# CMS and Public Catalog Platform


This repository contains a full-stack CMS and public catalog application designed to manage and publish structured video content.
The system supports role-based access, scheduled publishing, and a public read-only catalog.

The project focuses on clean architecture, production-ready patterns, and clear separation of concerns.

## Architecture Overview

The system is composed of three main services:

Web (Next.js) -> API (Node.js + Express) -> Database (PostgreSQL / Supabase)
                       ^
Worker (Cron-based background job)

- **Web**: Admin / Editor UI and public catalog UI
- **API**: CMS APIs, public catalog APIs, authentication and authorization
- **Worker**: Background process for scheduled publishing

The database is hosted externally using Supabase (PostgreSQL).

## Tech Stack

**Backend**
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL (Supabase)

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS

**Background Jobs**
- Standalone Node.js worker
- Cron-based execution

**Infrastructure**
- Docker
- Docker Compose
- Supabase
- Railway / Vercel

## Project Structure

The project is organized as a monorepo setup containing three distinct applications:

```
.
 apps/
    api/
       prisma/             # Database schema and migrations
       src/
          controllers/    # Request handlers
          middlewares/    # Auth and validation logic
          routes/         # API endpoints definitions
          services/       # Business logic (Catalog, Programs)
       Dockerfile          # Container configuration for API
   
    web/
       app/                # Next.js App Router pages
          dashboard/      # Admin CMS interface
          (public)/       # Public facing catalog
       components/         # Shared UI components
       Dockerfile          # Container configuration for Frontend
   
    worker/
        src/                # Worker logic
           publish.worker.ts # Cron job entry point
        Dockerfile          # Container configuration for Worker

 docker-compose.yml          # Orchestration for local development
 .env.example                # Template for environment variables
```

Each service is isolated with its own dependencies and configuration, allowing for independent development and deployment.

## Running Locally (Docker)

All services can be run locally using Docker Compose.

```bash
docker-compose up --build
```

This starts:
- API (Port 3001)
- Web (Port 3000)
- Worker (background execution)

The database remains external (Supabase).

## Environment Variables

Environment variables are shared across services and provided via a .env file.
An example file is provided:

```bash
cp .env.example .env
```

Sensitive values are not committed to the repository.

## Database & Migrations

This project uses **Prisma** for database management.

### Running Migrations

Apply migrations to update the database schema:
```bash
cd apps/api
npx prisma migrate dev
```

### Seeding Data

Populate the database with initial testing data (Programs, Terms, Lessons):
```bash
cd apps/api
npx prisma db seed
```

## Deployment

The application is deployed across multiple platforms to ensure optimal performance and scalability.

- **Frontend (Web)**: Deployed on **Vercel** for fast edge delivery and seamless Next.js integration.
  - Live Link: https://cms-tau-six.vercel.app/

- **Backend (API)**: Hosted on **Railway** as a persistent web service.
  - Health Check: https://cms-production-67cf.up.railway.app/health

- **Worker**: Deployed on **Railway** as a Cron Job to handle background tasks.
- **Database**: Managed PostgreSQL database hosted on **Supabase**.

## Login Credentials

Use the following credentials to access the admin dashboard:

- **Email**: `admin@test.com`
- **Password**: `Password@123`

## Demo Walkthrough

To experience the full lifecycle of the CMS, follow these steps:

1. **Login**: Access the dashboard using an **Editor** or **Admin** account.
2. **Create Content**: Navigate to `Programs` -> `Create Program`. Add Terms and Lessons draft.
   - *Note*: Lessons are created as **Draft** by default.
3. **Publish Lesson**: Edit the lesson again, change status to `Published`, and save.
   - *Requirement*: A Program is only visible in the public catalog if it contains **at least one published lesson**.
   - *Optimization*: Database updates may take a few moments to propagate to the public API due to caching.
4. **Schedule Publish**: Alternatively, set status to `Scheduled` with a future time.
5. **Verification**:
   - Check the **Dashboard**: Status updates to `Published`.
   - Check the **Public Catalog**: The content will appear on the homepage.

## Notes

1. Since the assessment provided creative freedom, I took the initiative to propose and implement architectural enhancements beyond the traditional flow, ensuring the final product effectively simulates a real-world production environment.
2. The site is hosted on free-tier deployments, so initial loading times may be slower than usual as services spin up. Loading skeletons and indicators have been added to improve the user experience.
3. Due to the nature of free-tier backend hosting and caching strategies, there may be a slight delay before edited data appears on the public homepage.
4. As this project heavily focuses on backend architecture, system design, and robustness, the User Interface (UI) is functional but prioritized less than the underlying logic. Please excuse any basic user experiences.
5. The database is hosted on Supabase. According to their official status, scheduled maintenance is expected on **January 16, 2026**. The site may experience connectivity issues or dysfunction during this maintenance window.
6. The background worker is deployed as a Railway Cron Job configured to run every **5 minutes**. When scheduling a program to be published, please allow a minimum span of 5 minutes for the changes to be processed and reflected.

## Message to Reviewers

I really learned a lot from the project as it was quite challenging! I have to take a moment and thank the creator of this assessment and the HR department for this wonderful experience. I feel happy as I did something creative after a long time and all credits to the company for this.

Lastly, I'm using my organizations's pay-as-you-go plan on Railway for this deployment. The cron jobs are currently running, so it would be helpful if I could stop the servers as quickly as possible after the review to reduce the bill.

Thank you once again with lots of love!
