require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDb, disconnectDb } = require('../config/db');
const env = require('../config/env');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const MentorProfile = require('../models/MentorProfile');

async function upsertUser({ name, email, password, role, status, branch }) {
  const passwordHash = await bcrypt.hash(password, 12);
  let user = await User.findOne({ email });
  if (user) {
    user.name = name;
    user.role = role;
    user.status = status;
    user.branch = branch || '';
    user.passwordHash = passwordHash;
    await user.save();
    return user;
  }
  return User.create({ name, email, passwordHash, role, status, branch });
}

async function seed() {
  await connectDb();

  const admin = await upsertUser({
    name: 'OfferOS Admin',
    email: env.adminEmail.toLowerCase(),
    password: env.adminPassword,
    role: 'admin',
    status: 'active',
  });

  const student = await upsertUser({
    name: 'Aarav Sharma',
    email: 'student@offeros.dev',
    password: 'Student@12345',
    role: 'student',
    status: 'active',
    branch: 'CSE',
  });
  await StudentProfile.findOneAndUpdate(
    { userId: student._id },
    {
      userId: student._id,
      branch: 'CSE',
      college: 'Demo Institute of Technology',
      degree: 'B.Tech',
      graduationYear: 2026,
      onboardingCompleted: false,
      targetRole: 'Software Engineer',
      skills: ['Java', 'Python', 'DSA'],
    },
    { upsert: true }
  );

  const mentor = await upsertUser({
    name: 'Priya Nair',
    email: 'mentor@offeros.dev',
    password: 'Mentor@12345',
    role: 'mentor',
    status: 'active',
  });
  await MentorProfile.findOneAndUpdate(
    { userId: mentor._id },
    {
      userId: mentor._id,
      approvalStatus: 'approved',
      currentCompany: 'Amazon',
      jobTitle: 'SDE II',
      experienceYears: 4,
      skills: ['DSA', 'System Design', 'Java'],
      bio: 'Demo mentor account for OfferOS development.',
      rating: 4.8,
      studentsHelped: 32,
      sessionsCompleted: 48,
      mentorScore: 860,
    },
    { upsert: true }
  );

  const pending = await upsertUser({
    name: 'Rahul Verma',
    email: 'pending.mentor@offeros.dev',
    password: 'Mentor@12345',
    role: 'mentor',
    status: 'pending',
  });
  await MentorProfile.findOneAndUpdate(
    { userId: pending._id },
    { userId: pending._id, approvalStatus: 'pending' },
    { upsert: true }
  );

  console.log('Seed complete');
  console.log(`  Admin:   ${admin.email}`);
  console.log(`  Student: student@offeros.dev / Student@12345`);
  console.log(`  Mentor:  mentor@offeros.dev / Mentor@12345`);
  console.log(`  Pending: pending.mentor@offeros.dev (cannot log in until approved)`);

  await disconnectDb();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
