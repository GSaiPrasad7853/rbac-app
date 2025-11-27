# Role-Based User Management Web Application

This is a simple role-based user management web application with **Admin** and **Student** roles.

It demonstrates:

- JWT-based authentication
- Role-based access control
- Clean separation of backend (API) and frontend (React)
- Admin-only user management
- Basic password policies and edge case handling

## Tech Stack

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs

**Frontend**

- React
- React Router
- Axios
- Vite

## Setup Instructions

### 1. Clone

```bash
git clone &lt;your-repo-url&gt;
cd rbac-app
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values (especially `MONGO_URI`, `JWT_SECRET`, and admin credentials).

Then run:

```bash
npm run dev
```

This will:

- Connect to MongoDB
- Seed the default admin user if it doesn't exist yet

### 3. Frontend

In another terminal:

```bash
cd ../frontend
npm install
npm run dev
```

Open the printed URL (default: `http://localhost:5173`).

## Default Admin Credentials

From `backend/.env` (example):

- Email: `admin@example.com`
- Password: `Admin@123`

## Basic Flow

1. **Student Registration**

   - Go to `/register`
   - Fill in your details
   - Login using your new account

2. **Student Features**

   - After login, you are redirected to `/welcome`
   - You can change password from the welcome page

3. **Admin Features**

   - Login with admin credentials
   - You will be redirected to `/admin`
   - Admin can:
     - View all users
     - Create new users (Admin or Student)
     - Delete users (except themselves)
   - Admin can also change their own password from the `Change Password` page

## API Overview (Short)

Base URL: `http://localhost:5000/api`

- `POST /auth/register` – Student registration
- `POST /auth/login` – Login
- `POST /auth/change-password` – Change password (auth required)
- `GET /auth/me` – Current user info (auth required)
- `GET /admin/users` – List users (admin only)
- `POST /admin/users` – Create user (admin only)
- `DELETE /admin/users/:id` – Delete user (admin only)

## Notes

- This project is meant as a learning / hackathon-style example.
- Feel free to rename variables, improve UI, or extend features (e.g. forgot password, more roles, better password policy).
