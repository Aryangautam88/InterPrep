const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createApp } = require('../src/app');
const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');
const MentorProfile = require('../src/models/MentorProfile');

const TEST_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/offeros-test';
let app;

beforeAll(async () => {
  await mongoose.connect(TEST_URI);
  app = createApp();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

describe('Auth', () => {
  test('registers a student and returns access token + refresh cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student@test.dev',
        password: 'Student@123',
        role: 'student',
        branch: 'CSE',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.role).toBe('student');
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie']?.join(';')).toMatch(/refreshToken=/);
    const profile = await StudentProfile.findOne({ userId: res.body.data.user.id });
    expect(profile).toBeTruthy();
  });

  test('does not allow public admin registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Hacker',
        email: 'admin@test.dev',
        password: 'Admin@1234',
        role: 'admin',
      });
    expect(res.status).toBe(400);
  });

  test('mentor registration requires approval and cannot log in', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mentor',
        email: 'mentor@test.dev',
        password: 'Mentor@123',
        role: 'mentor',
      });
    expect(reg.status).toBe(201);
    expect(reg.body.data.pendingApproval).toBe(true);
    expect(reg.body.data.accessToken).toBeUndefined();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'mentor@test.dev', password: 'Mentor@123' });
    expect(login.status).toBe(403);
    expect(login.body.error.code).toBe('MENTOR_PENDING');
  });

  test('login returns JWT and me works', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Asha Rao',
      email: 'a@test.dev',
      password: 'Student@123',
      role: 'student',
      branch: 'IT',
    });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a@test.dev', password: 'Student@123' });
    expect(login.status).toBe(200);

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe('a@test.dev');
  });

  test('protects routes without JWT', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('enforces role authorization', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Sana Khan',
      email: 's@test.dev',
      password: 'Student@123',
      role: 'student',
      branch: 'CSE',
    });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 's@test.dev', password: 'Student@123' });
    const token = login.body.data.accessToken;

    const forbidden = await request(app)
      .get('/api/admin/ping')
      .set('Authorization', `Bearer ${token}`);
    expect(forbidden.status).toBe(403);

    const allowed = await request(app)
      .get('/api/student/ping')
      .set('Authorization', `Bearer ${token}`);
    expect(allowed.status).toBe(200);
  });

  test('approved mentor can access mentor routes but not admin', async () => {
    const passwordHash = await bcrypt.hash('Mentor@123', 12);
    const user = await User.create({
      name: 'M',
      email: 'ok@test.dev',
      passwordHash,
      role: 'mentor',
      status: 'active',
    });
    await MentorProfile.create({ userId: user._id, approvalStatus: 'approved' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ok@test.dev', password: 'Mentor@123' });
    const token = login.body.data.accessToken;

    const mentorOk = await request(app)
      .get('/api/mentor/ping')
      .set('Authorization', `Bearer ${token}`);
    expect(mentorOk.status).toBe(200);

    const adminNo = await request(app)
      .get('/api/admin/ping')
      .set('Authorization', `Bearer ${token}`);
    expect(adminNo.status).toBe(403);
  });

  test('refresh issues a new access token from the httpOnly cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Ravi Iyer',
      email: 'r@test.dev',
      password: 'Student@123',
      role: 'student',
      branch: 'ECE',
    });
    const cookies = reg.headers['set-cookie'];
    const refreshed = await request(app).post('/api/auth/refresh').set('Cookie', cookies);
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.accessToken).toBeTruthy();
    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${refreshed.body.data.accessToken}`);
    expect(me.status).toBe(200);
  });
});
