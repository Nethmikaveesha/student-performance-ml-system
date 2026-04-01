# Smart Student Performance Prediction System

A full-stack MERN + Python (Scikit-learn) project that predicts student performance (`Weak`, `Average`, `Strong`) using learning behavior data.

---

## Features

- Secure authentication with **bcrypt** password hashing
- **JWT-based** login session
- Protected API routes with role checks (**student** / **teacher**)
- Student dashboard (predict, quizzes, progress)
- Teacher dashboard (student overview and class insights)
- ML integration with Python model (`ml-model/predict.py`)
- Error handling for validation, network, and server failures

---

## Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **ML:** Python, pandas, scikit-learn, joblib
- **Auth:** bcryptjs, jsonwebtoken
- **Testing:** Node test + supertest, Vitest

---

## Project Structure

```bash
student-performance-ml-system/
├── frontend/         # React + Vite app
├── backend/          # Express API + MongoDB
└── ml-model/         # train_model.py, predict.py, dataset/, model/
