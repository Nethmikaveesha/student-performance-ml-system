# Smart Student Performance Prediction System

A full-stack MERN + Python (Scikit-learn) project that predicts student academic performance (`Weak`, `Average`, `Strong`) based on learning behavior metrics.

## Project Structure

```
student-performance-ml-system/
??? backend/
?   ??? config/
?   ?   ??? db.js
?   ??? controllers/
?   ?   ??? predictionController.js
?   ??? models/
?   ?   ??? Prediction.js
?   ??? routes/
?   ?   ??? predictionRoutes.js
?   ??? services/
?   ?   ??? pythonService.js
?   ??? .env.example
?   ??? package.json
?   ??? server.js
??? frontend/
?   ??? src/
?   ?   ??? components/
?   ?   ?   ??? HistoryTable.jsx
?   ?   ?   ??? PredictionResult.jsx
?   ?   ?   ??? StudentForm.jsx
?   ?   ??? services/
?   ?   ?   ??? api.js
?   ?   ??? App.jsx
?   ?   ??? main.jsx
?   ?   ??? styles.css
?   ??? index.html
?   ??? package.json
?   ??? vite.config.js
??? ml/
?   ??? artifacts/
?   ??? generate_dataset.py
?   ??? predict.py
?   ??? requirements.txt
?   ??? student-data.csv
?   ??? train_model.py
??? student-data.csv
??? README.md
```

## End-to-End Flow

1. User submits student behavior metrics from React form.
2. Express API receives request and forwards feature payload to Python script.
3. Python loads trained Scikit-learn model, predicts class, and returns JSON.
4. Node backend stores input + prediction in MongoDB.
5. React displays prediction and recent history.

## Setup Instructions

### 1) Generate Dataset and Train Model

```bash
cd ml
pip install -r requirements.txt
python generate_dataset.py
python train_model.py
```

### 2) Start Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `.env` if your Python command is `python3` or custom path.

### 3) Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/health` - health check
- `POST /api/predictions` - run prediction and save result
- `GET /api/predictions/history` - fetch last 50 predictions

### Example `POST /api/predictions` body

```json
{
  "studentId": "STU9001",
  "studyTime": 3.5,
  "attendancePercentage": 88,
  "quizScore": 79,
  "assignmentCompletion": 8,
  "numberOfAttempts": 2,
  "lessonCompletionPercentage": 85
}
```

## Notes

- `student-data.csv` (500 rows) is generated synthetically using realistic academic behavior patterns.
- Model files are saved under `ml/artifacts/` after training.
- Backend uses `child_process.spawn` to integrate Python predictions safely.
