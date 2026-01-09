## Purpose
This file orients AI coding agents to the CourseScope repo so they can be productive immediately.

### Big picture
- Frontend: React + Vite app in `client/` (uses Context API for auth). See [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx).
- Backend: Node.js + Express API in `server/` with routes -> controllers -> DB. Entry: `server/server.js`.
- Data: PostgreSQL; schema and migrations live in `server/schema.sql` and `server/migrations/`.
- Uploads: Cloudinary integration configured in `server/config/cloudinary.js` and used by `server/controllers/uploadController.js`.

### Key integration points (examples)
- API base: frontend calls `VITE_API_URL` (set in `client/.env`) and hits paths under `/api/*` implemented in `server/routes/*.js`.
- Auth: JWT issued in `server/controllers/authController.js`, verified by `server/middleware/auth.js` — many endpoints expect `Authorization: Bearer <token>`.
- DB access: `server/config/db.js` centralizes Postgres connection used across controllers.

### Important files to inspect
- Frontend auth flow: [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx)
- Frontend API wrapper: [client/src/services/api.js](client/src/services/api.js)
- Server routes: [server/routes](server/routes/) (e.g. `courseRoutes.js` -> `courseController.js`)
- Server controllers: [server/controllers](server/controllers/) (business logic lives here)
- DB schema & migrations: [server/schema.sql](server/schema.sql) and [server/migrations](server/migrations/)
- Cloudinary config: [server/config/cloudinary.js](server/config/cloudinary.js)
- Server DB config: [server/config/db.js](server/config/db.js)

### Development workflows (concrete)
- Install deps: `cd server && npm install` and `cd client && npm install` (see root README).
- Run backend in dev with auto-reload: `cd server && npm run dev` (uses `nodemon`).
- Run frontend dev server: `cd client && npm run dev` (Vite).
- Build frontend: `cd client && npm run build`.
- Lint frontend: `cd client && npm run lint`.

### Patterns and conventions specific to this repo
- Routes delegate to controllers (thin route files). Modify controllers for business logic, not routes.
- API responses follow JSON shapes consumed by the frontend pages in `client/src/pages/` and `client/src/components/`.
- Profile pictures are stored via Cloudinary and a DB column was added (see `add_profile_picture.sql`).
- Helpful vote feature persisted by a migration (`add_helpful_votes.sql`) and exposed through `voteRoutes.js` + `voteController.js`.

### What to watch for when editing
- Changing API shapes requires coordinated frontend updates in `client/src/services/api.js` and any callers in `client/src/pages/`.
- Auth: token handling is centralized in `AuthContext.jsx`; updating token format or expiry needs updates there and in request headers.
- DB migrations: add SQL migration files to `server/migrations/` and reference them in setup instructions.

### Debugging tips
- Confirm `VITE_API_URL` matches backend dev URL (default `http://localhost:5000/api`).
- Use `npm run dev` on server (nodemon) to get auto-restart on JS changes.

### Examples of actionable edits
- To add a new course endpoint: add `server/routes/courseRoutes.js` route, implement `server/controllers/courseController.js` function, and update frontend call in `client/src/services/api.js` and any consuming page (e.g. [client/src/pages/CourseDetail.jsx](client/src/pages/CourseDetail.jsx)).

If anything here is unclear or you want me to expand a section (DB setup, common request/response shapes, or frontend state flows), tell me which area and I'll iterate.
