# CareerConnect Job Portal

A React job portal with a Vite frontend and an Express API. Browse and filter job listings, view job details, register or sign in, save jobs, and track applications.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

Start the API in one terminal:

```sh
cd backend
npm install
node server.js
```

Start the frontend in another terminal from the project root:

```sh
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and expects the API at `http://localhost:5000`.
For a hosted backend, configure a strong `JWT_SECRET` environment variable. Local development generates a temporary secret automatically.

## Checks

```sh
npm run build
npm run test:run
```

The backend currently uses in-memory storage, so users and jobs are not persisted across restarts. Saved jobs and applications are stored in the browser. This project is configured for local development and needs a deployed API and production API URL before it can run as a public website.
