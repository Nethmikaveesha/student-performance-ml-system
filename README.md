# Smart Student Performance Prediction System

**Smart Student Performance Prediction System** is a full-stack MERN + Python application that predicts student performance as **Weak**, **Average**, or **Strong** using key learning behavior data.  
It provides role-based dashboards for students and teachers to support progress tracking and class-level insights.  
The platform uses secure authentication with bcrypt and JWT, along with protected APIs and validated prediction inputs.  
Its goal is to enable early academic intervention through reliable, data-driven performance forecasting.

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

---
## Functional requirements

### Student functional requirements

- Register and log in using `name`, `email`, `password`, and role `student`.
- Access only student-protected APIs using JWT bearer token.
- Submit prediction inputs: `studyTime`, `attendancePercentage`, `quizScore`, `assignmentCompletion`, `numberOfAttempts`, `lessonCompletionPercentage`.
- Receive prediction result (`Weak`, `Average`, `Strong`) from backend ML integration.
- Submit quiz score (`0-100`) and store it against the logged-in student identity.
- View own prediction history and own quiz history.
- Use result-page actions: back to dashboard, predict again, download report.
- See clear frontend error messages for validation, server, and network failures.
- Stay logged in via token persistence and be logged out by clearing local auth state.

### Teacher functional requirements

- Register and log in using role `teacher`.
- Access only teacher-protected APIs using JWT bearer token.
- View all students list and class-level prediction/quiz data.
- View prediction history across students for class insights.
- Retrieve quiz data across students for monitoring.
- Add students manually via protected student-creation endpoint (if needed by admin/teacher flow).
- See updated dashboard data after relevant student actions and after login.
- Receive proper authorization errors (`401`/`403`) when access is invalid.
---

## Install and run (local)

```bash
# ML model (once)
cd ml-model
pip install pandas scikit-learn joblib
python train_model.py

# Backend
cd ../backend
npm install
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```


