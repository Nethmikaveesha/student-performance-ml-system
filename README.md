# Smart Student Performance Prediction System

A full-stack MERN + Python (Scikit-learn) project that predicts student performance (`Weak`, `Average`, `Strong`) using learning behavior data.

---

## Features

- Secure authentication using `bcrypt` password hashing
- JWT-based login sessions
- Protected API routes with role-based access (`student` / `teacher`)
- Student dashboard (prediction, quizzes, progress tracking)
- Teacher dashboard (student overview and class insights)
- Machine Learning integration using Python (`ml-model/predict.py`)
- Proper error handling (validation, network errors, server errors)

---

## Functional Requirements

### 1. User Registration
- The system shall allow users to register as either `student` or `teacher`.
- The system shall require the following details:
  - `name`
  - `email`
  - `password`
  - `role`
- The system shall reject duplicate email registrations.
- The system shall generate and store a unique `studentId` for student accounts.

### 2. User Authentication
- The system shall hash passwords using `bcrypt` before storing them.
- The system shall authenticate users using:
  - `email`
  - `password`
  - `role`
- The system shall issue a JWT token after successful login.
- The system shall allow users to retrieve their profile using the token (`/api/auth/me`).

### 3. Authorization & Access Control
- The system shall require a valid JWT token for protected routes.
- The system shall restrict access based on user role:
  - Students -> prediction, quiz submission, own history
  - Teachers -> student performance and class insights
- The system shall return proper HTTP responses (`401`, `403`) for unauthorized access.

### 4. Student Identity Consistency
- The system shall use the logged-in student's `studentId` from the JWT token.
- The system shall not trust any `studentId` sent from the frontend.

### 5. Prediction Input Handling
The system shall accept the following inputs:
- Study time
- Attendance percentage
- Quiz score
- Assignment completion percentage
- Number of attempts
- Lesson completion percentage

The system shall validate the following ranges:
- Study time: `0 - 6`
- Attendance: `40 - 100`
- Quiz score: `0 - 100`
- Assignment completion: `0 - 100`
- Attempts: `1 - 5`
- Lesson completion: `0 - 100`

Invalid inputs shall be rejected with clear error messages.

### 6. Prediction Generation
- The system shall call the Python ML model from the backend.
- The system shall return one of the following results:
  - `Weak`
  - `Average`
  - `Strong`
- The system shall store prediction inputs and results in the database with a timestamp.

### 7. Quiz Submission
- The system shall allow students to submit quiz scores.
- Quiz score must be between `0 - 100`.
- Quiz results shall be stored using the logged-in student's identity.
- Teachers and students shall be able to retrieve quiz data based on role permissions.

### 8. Student Dashboard
Students shall be able to:
- Submit prediction data
- Submit quizzes
- View personal progress/history
- View prediction results

The result page shall include:
- Back to dashboard
- Predict again
- Download report

### 9. Teacher Dashboard
Teachers shall be able to:
- View student lists
- View prediction results
- View student performance trends
- Access class insights

### 10. Data Refresh Behavior
The system shall refresh data automatically:
- After prediction submission
- After quiz submission
- After login

The dashboard shall stay updated without refreshing the browser manually.

### 11. Error Handling (Frontend)
The system shall display:
- Validation errors
- Server errors (`500`)
- Network/offline errors

Clear API error messages shall be shown to the user.

### 12. Session Handling (Frontend)
- The system shall store the JWT token in browser storage.
- The system shall automatically attach the token to protected API requests.
- The system shall clear authentication data after logout.

### 13. Navigation Rules
- Users shall be redirected to the correct dashboard after login.
- Users shall **NOT** be redirected automatically after registration.
- The result page shall be displayed without the main header/footer.

---

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### Machine Learning
- Python
- pandas
- scikit-learn
- joblib

### Authentication
- bcryptjs
- jsonwebtoken

---




