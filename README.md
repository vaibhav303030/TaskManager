# Task Tracker (MERN Stack)

A simple full-stack Task Tracker built with **MongoDB, Express, React, and Node.js**.
It supports Create, Read, Update, and Delete (CRUD) of tasks through a REST API, with
form validation on both the frontend and backend, and a responsive UI that updates
instantly without page refreshes.

The code is intentionally kept simple — plain functional React components with hooks
(`useState`, `useEffect`), and a small Express app with one model and one route file.
No Redux, no TypeScript, no extra abstractions.

---

## Tech Stack

| Layer    | Technology                          |
|----------|--------------------------------------|
| Frontend | React (Vite), plain CSS              |
| Backend  | Node.js, Express.js                  |
| Database | MongoDB (Mongoose)                   |

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema for a task
│   ├── routes/
│   │   └── taskRoutes.js    # CRUD REST API routes
│   ├── server.js            # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TaskForm.jsx   # Create/edit form with validation
    │   │   ├── TaskList.jsx   # Renders the grid of tasks
    │   │   └── TaskItem.jsx   # A single task card
    │   ├── App.jsx            # Main component, holds state + API calls
    │   ├── App.css            # Responsive styling
    │   ├── index.css          # Global reset
    │   └── main.jsx           # React entry point
    ├── index.html
    ├── package.json
    └── .env.example
```

---

## Features

- Create, view, edit, and delete tasks
- Each task has: title, description, status (Pending / In Progress / Completed),
  priority (Low / Medium / High), and an optional due date
- Click a task's status pill to quickly cycle it to the next status
- Filter tasks by status
- Client-side validation (title required, min length, max description length, etc.)
- Server-side validation as a second line of defense (never trust the client alone)
- Fully responsive layout (mobile, tablet, desktop)
- All updates happen via `fetch` calls to the REST API — the page never reloads

---

## 1. Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A MongoDB database — either:
  - Installed locally (`mongodb://localhost:27017`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended, and required for deployment anyway)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI to your connection string
npm run dev        # uses nodemon, auto-restarts on changes
# or: npm start
```

The API will start on `http://localhost:5000` (or whatever `PORT` you set).

### Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL should already point to http://localhost:5000/api/tasks
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`. Open it in your browser.

---

## 2. REST API Reference

Base path: `/api/tasks`

| Method | Endpoint          | Description           | Body (JSON)                                              |
|--------|-------------------|------------------------|------------------------------------------------------------|
| GET    | `/api/tasks`      | Get all tasks          | —                                                            |
| GET    | `/api/tasks/:id`  | Get one task           | —                                                            |
| POST   | `/api/tasks`      | Create a task          | `{ title, description?, status?, priority?, dueDate? }`     |
| PUT    | `/api/tasks/:id`  | Update a task          | Any subset of the fields above                              |
| DELETE | `/api/tasks/:id`  | Delete a task          | —                                                            |

`title` is required (min 3 characters). All other fields are optional and default to
`status: "Pending"`, `priority: "Medium"`.

---

## 3. Deploying to a Public URL

This deploys the **database** on MongoDB Atlas, the **backend** on Render, and the
**frontend** on Vercel — all of which have free tiers and don't need a credit card
for the free tier itself.

### Step A — MongoDB Atlas (database)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free **M0 cluster**
3. Under **Database Access**, create a database user with a username/password
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere — fine for a demo project)
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskTracker
   ```
6. Keep this string handy — you'll paste it into Render in the next step

### Step B — Backend on Render

1. Push this project to a GitHub repository
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo, and set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables under "Environment":
   - `MONGO_URI` = your Atlas connection string from Step A
   - `CLIENT_ORIGIN` = your frontend URL (you can update this after Step C)
   - `PORT` = `5000` (Render sets its own `PORT` automatically, but it doesn't hurt)
5. Deploy. Render gives you a public URL like `https://task-tracker-backend.onrender.com`
6. Visit that URL in your browser — you should see `Task Tracker API is running`

### Step C — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the same GitHub repo
2. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add an environment variable:
   - `VITE_API_URL` = `https://task-tracker-backend.onrender.com/api/tasks` (your Render URL + `/api/tasks`)
4. Deploy. Vercel gives you a public URL like `https://task-tracker.vercel.app`

### Step D — Connect them

Go back to Render → your backend service → Environment, and update `CLIENT_ORIGIN`
to your Vercel URL (e.g. `https://task-tracker.vercel.app`), then redeploy the
backend so CORS allows requests from your live frontend.

You now have a fully working MERN app on public URLs:
- Frontend: your Vercel URL
- Backend API: your Render URL
- Database: MongoDB Atlas

> Netlify works just as well as Vercel for the frontend if you prefer it — the steps
> are nearly identical (root directory `frontend`, build command `npm run build`,
> publish directory `dist`).

---

## 4. Notes

- Render's free tier spins down after inactivity, so the first request after idling
  can take 30-60 seconds to wake up — this is normal, not a bug.
- If you ever see a CORS error in the browser console after deploying, double-check
  that `CLIENT_ORIGIN` on the backend exactly matches your frontend's URL (no trailing slash).
