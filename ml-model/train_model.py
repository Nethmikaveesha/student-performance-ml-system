from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


def main():
    base = Path(__file__).resolve().parent
    data_path = base / 'dataset' / 'student-data.csv'
    model_path = base / 'model' / 'student_model.pkl'

    df = pd.read_csv(data_path)

    feature_cols = [
        'study_time',
        'attendance_percentage',
        'quiz_score',
        'assignment_completion',
        'number_of_attempts',
        'lesson_completion_percentage',
    ]

    X = df[feature_cols]
    y = df['final_performance']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(n_estimators=250, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    pred = model.predict(X_test)
    print(f'Accuracy: {accuracy_score(y_test, pred):.4f}')

    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({'model': model, 'features': feature_cols}, model_path)
    print(f'Model saved to {model_path}')


if __name__ == '__main__':
    main()
