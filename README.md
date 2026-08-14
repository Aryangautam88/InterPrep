# OfferOS

Placement preparation and career management for B.Tech students.

**Brand:** OfferOS  
**Product:** PlacementOS

## Stack

- Client: React, Vite, React Router, Axios, CSS Modules, Framer Motion
- Server: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Setup

1. Copy env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Start MongoDB locally.

3. Install and seed:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run seed
```

4. Run:

```bash
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@offeros.dev | Admin@12345 |
| Student | student@offeros.dev | Student@12345 |
| Mentor (approved) | mentor@offeros.dev | Mentor@12345 |
| Mentor (pending) | pending.mentor@offeros.dev | Mentor@12345 |

Admin accounts cannot be created via public registration.
