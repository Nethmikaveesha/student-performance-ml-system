# Smart Student Performance Prediction System

Full-stack MERN app plus a Python (Scikit-learn) model that predicts student performance as **Weak**, **Average**, or **Strong** from study habits and scores.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Vite + React UI |
| `backend/` | Express + Mongoose API, JWT auth, calls `ml-model/predict.py` |
| `ml-model/` | **Canonical** training data, `train_model.py`, `predict.py`, and `model/student_model.pkl` |

There is no separate `ml/` tree in this repo; use **`ml-model/`** for all ML work.

## Prerequisites

- Node.js 18+
- Python 3 with `pandas`, `scikit-learn`, `joblib`
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Environment variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

- `MONGO_URI` — Mongo connection string (required)
- `PORT` — default `5000`
- `PYTHON_PATH` — e.g. `python` or `python3`
- `ML_PREDICT_SCRIPT` — path to `predict.py` (default `../../ml-model/predict.py` relative to `backend/ml-integration`)
- `JWT_SECRET` — **required in production**; use a long random string
- `JWT_EXPIRES_IN` — optional, default `7d`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` — e.g. `http://localhost:5000/api` (omit to use this default)

## Install and run (local)

```bash
# ML model (once)
cd ml-model
pip install pandas scikit-learn joblib
python train_model.py

# Backend
cd ../backend
cp .env.example .env   # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). The UI stores a JWT in `localStorage` after login/register and sends `Authorization: Bearer <token>` on API calls.

## Auth and roles

- Passwords are hashed with **bcrypt**; plaintext passwords are not stored.
- **Register** and **login** return a **JWT** plus user profile (`studentId` is only on student accounts).
- **Students**: `POST /api/predictions`, `POST /api/quiz`, `GET /api/predictions/history` (own rows only), `GET /api/quiz` (own quizzes).
- **Teachers**: `GET /api/students`, `GET /api/teachers`, `GET /api/predictions/history` (all), `GET /api/quiz` (all), `POST /api/students` (manual student creation).
- **Legacy accounts** created before bcrypt: first successful login with the correct plaintext password re-hashes and saves the password automatically.

## Training the model

```bash
cd ml-model
python train_model.py
```

This reads `dataset/student-data.csv` and writes `model/student_model.pkl`. Prediction features must stay aligned with training (see backend validation): study time 0–6 h, attendance 40–100%, quiz 0–100%, assignments 0–10 (or 0–100% scaled server-side), attempts 1–5, lessons 0–100%.

## API tests (backend)

```bash
cd backend
npm test
```

Smoke checks: health route, unauthenticated prediction history, login validation, protected students route.

## Frontend smoke test

```bash
cd frontend
npm test
```

## Demo accounts

There are no built-in seed users. Register a **student** and a **teacher** via the UI (or call `POST /api/auth/register`), then log in with the chosen role.

## Deployment (outline)

1. **MongoDB Atlas** — create a cluster, allow your app host IP (or `0.0.0.0/0` for trials), copy URI into `MONGO_URI`.
2. **Backend** — deploy to Render, Railway, Fly.io, etc.; set env vars; ensure Python and `ML_PREDICT_SCRIPT` path are valid on the host (or containerize with Node + Python).
3. **Frontend** — deploy to Vercel or Netlify; set `VITE_API_BASE_URL` to your public API URL (e.g. `https://api.example.com/api`).
4. Use **HTTPS** everywhere; set a strong `JWT_SECRET` in production.
