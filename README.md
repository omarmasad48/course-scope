# CourseScope

A full-stack course review platform for San Diego City College students.

## Features

- 🔐 User authentication with JWT (.edu email required)
- 📚 Browse and search courses by department
- ⭐ Write detailed course reviews with ratings
- 👍 Helpful votes on reviews
- 📸 Profile picture uploads with Cloudinary
- 💬 Real-time UI updates

## Tech Stack

### Frontend
- React + Vite
- React Router
- Context API for state management

### Backend
- Node.js + Express
- PostgreSQL
- JWT authentication
- Cloudinary for image storage

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Cloudinary account

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd course-scope
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables

Create `server/.env`:
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/coursescope
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

4. Set up database
```bash
# Create database and run migrations
psql -U postgres -c "CREATE DATABASE coursescope;"
psql -U postgres -d coursescope -f server/schema.sql
psql -U postgres -d coursescope -f server/migrations/add_helpful_votes.sql
psql -U postgres -d coursescope -f server/migrations/add_profile_picture.sql
```

5. Run development servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Deployment

- Backend: Railway
- Frontend: Vercel
- Database: Railway PostgreSQL

## License

MIT
