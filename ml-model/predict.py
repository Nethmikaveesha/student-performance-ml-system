import json
import sys
from pathlib import Path

import joblib
import pandas as pd


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Missing payload'}))
        sys.exit(1)

    payload = json.loads(sys.argv[1])

    model_path = Path(__file__).resolve().parent / 'model' / 'student_model.pkl'
    bundle = joblib.load(model_path)
    model = bundle['model']
    features = bundle['features']

    row = pd.DataFrame([
        {
            'study_time': float(payload['study_time']),
            'attendance_percentage': float(payload['attendance_percentage']),
            'quiz_score': float(payload['quiz_score']),
            'assignment_completion': float(payload['assignment_completion']),
            'number_of_attempts': float(payload['number_of_attempts']),
            'lesson_completion_percentage': float(payload['lesson_completion_percentage']),
        }
    ])

    prediction = model.predict(row[features])[0]
    print(json.dumps({'prediction': prediction}))


if __name__ == '__main__':
    main()
