# Cyphlab Task Manager

A professional task management platform featuring role-based access control, project assignment, task status updates, and user role management.

## Tech Stack
- Frontend: Next.js (App Router, Tailwind CSS, Lucide Icons)
- Backend: Node.js (Express, Cors, Helmet)
- Database: PostgreSQL (Prisma ORM)

## Roles
- **Admin**: Has full access to manage users, alter user roles, delete users, and perform all manager actions.
- **Manager**: Can create projects, add members to projects, and assign/delete tasks.
- **Member**: Can view projects they belong to, view associated tasks, and update task statuses.

## Setup and Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database instance

### Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file based on `.env.example`.
4. Apply Prisma migrations and generate Prisma Client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file based on `.env.example`.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
