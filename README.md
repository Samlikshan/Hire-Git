## Hire – Job Marketplace (Client + Server)

A full-stack job marketplace platform with candidate and company portals, real-time chat, interview scheduling, subscriptions, and an admin dashboard. The repository contains a React + TypeScript client (Vite) and a Node.js + TypeScript server (Express + MongoDB), structured with `client/` and `server/` workspaces.

---

### Live Demo

- Live App: https://www.hirestack.site

---

### Admin Test Credentials

- Url: https://www.hirestack.site/admin-login
- Email: `admin@gmail.com`
- Password: `Admin@123`

---

### Features

- Candidate and Company authentication (register, login, email verification, password reset)
- Company profiles and job postings; candidate job search, save, and apply
- Application status tracking: Scheduled, Hired, Rejected, etc.
- Real-time chat and interview scheduling (Socket.io)
- Notifications system
- Subscriptions and plan management
- Admin dashboard for oversight and management

---

### Tech Stack

- Client
  - React + TypeScript (Vite)
  - Redux Toolkit
  - Tailwind CSS
  - Shadcn/ui components (see `client/src/components/ui/*`)

- Server
  - Node.js + TypeScript
  - Express
  - MongoDB (Mongoose)
  - Socket.io for realtime features
  - JWT auth, bcrypt hashing
  - Nodemailer (email) and Multer (uploads)

---

### Repository Structure

```
.
├─ client/                 # React + TS app (Vite)
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/        # API clients (axios)
│  │  ├─ reducers/        # Redux slices
│  │  └─ routes/          # Route guards and route configs
│  └─ public/
└─ server/                 # Node + TS API (Express + MongoDB)
   ├─ src/
   │  ├─ config/          # app, env, socket, thirdParty
   │  ├─ domain/          # entities, repositories, usecases, interfaces
   │  ├─ infrastructure/  # database, logger, services
   │  ├─ interfaces/      # controllers, routes, middlewares, validators
   │  └─ utils/           # email/hash/jwt/multer services
   └─ dist/               # compiled JS
```

---

### Prerequisites

- Node.js LTS (>= 18 recommended)
- npm or pnpm/yarn
- MongoDB database (Atlas or local)

---

### Quick Start

Clone and install dependencies:

```bash
# From the repository root
npm run install:all
# or install client and server separately
cd client && npm install && cd ..
cd server && npm install && cd ..
```

Start development servers (client and API):

```bash
# In separate terminals, or using the scripts below
npm run dev:server    # starts server (watch)
npm run dev:client    # starts client (Vite)
```

Optional root-level helper scripts to add to your root package.json:

```json
{
  "scripts": {
    "install:all": "cd client && npm i && cd .. && cd server && npm i && cd ..",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build:all": "cd client && npm run build && cd .. && cd server && npm run build && cd ..",
    "start:server": "cd server && npm run start"
  }
}
```

If these scripts are not present, run the equivalent commands manually as shown above.

---

### Environment Variables

Create `.env` files for both client and server before running locally.

Client `.env` (Vite requires `VITE_` prefix):

```bash
# client/.env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Server `.env`:

```bash
# server/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hirestack
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
EMAIL_FROM=no-reply@yourdomain.com

# 3rd party keys if used (stripe, cloud storage, etc.)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Update these values to match your deployment URLs and provider credentials for production.

---

### Running the Client

```bash
cd client
npm install
npm run dev        # starts Vite dev server (default http://localhost:5173)
npm run build      # builds to client/dist
npm run preview    # previews production build
```

### Running the Server

```bash
cd server
npm install
npm run dev        # ts-node-dev / nodemon + ts-node (watch mode)
npm run build      # tsc compiles to dist
npm start          # runs compiled server from dist
```

---

### API Overview (high level)

- Auth: register, login, email verification, reset password
- Jobs: CRUD (company), list/search (candidate), applications
- Applications: create, status updates (Scheduled/Hired/Rejected), notifications
- Chat/Interview: real-time messaging, scheduling
- Subscriptions: plans, checkout, webhooks
- Admin: dashboard endpoints for management

Explore `server/src/interfaces/routes` and `server/src/interfaces/controllers` for route definitions and handlers.

---

### Notable Client Paths

- `client/src/components/pages/*` – main pages (e.g., CandidateHomePage, Company, Admin, etc.)
- `client/src/services/*` – API clients (`axiosInstance.ts`, `auth.ts`, `job.ts`, etc.)
- `client/src/reducers/*` – Redux slices and root reducer
- `client/src/routes/*` – route guards and grouped route configs

---

### Deployment

- Client
  - The project includes `client/vercel.json`, suggesting Vercel deployment support.
  - Build: `cd client && npm run build` then deploy `client/dist`.

- Server
  - Deploy to any Node hosting (Render, Railway, AWS, etc.).
  - Ensure environment variables are configured and CORS `CLIENT_ORIGIN` matches your frontend domain.
  - If using Stripe or other webhooks, set the public webhook URL in provider settings and in your env.

---

### Troubleshooting

- If the client cannot reach the server, verify `VITE_API_BASE_URL` and CORS `CLIENT_ORIGIN`.
- Ensure MongoDB is running and `MONGO_URI` is correct.
- Check `server/logs/` (`all.log`, `error.log`) for server errors if logging is enabled.
- Email sending issues: verify SMTP creds and provider rules.
- Socket issues: ensure `VITE_SOCKET_URL` and server socket config are aligned.

---

### Acknowledgements

- Shadcn/ui
