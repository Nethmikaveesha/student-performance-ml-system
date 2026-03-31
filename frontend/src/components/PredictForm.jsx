import { useState } from 'react';

const initialState = {
  studentId: '',
  studyTime: '',
  attendancePercentage: '',
  quizScore: '',
  assignmentCompletion: '',
  numberOfAttempts: '',
  lessonCompletionPercentage: '',
};

const PredictForm = ({ onPredict, loading }) => {
  const [form, setForm] = useState(initialState);

  const update = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await onPredict(form);
  };

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h3>Performance Prediction</h3>
      <input required name="studentId" value={form.studentId} onChange={update} placeholder="Student ID" />
      <input required name="studyTime" value={form.studyTime} onChange={update} type="number" min="0" max="6" placeholder="Study Time (0-6)" />
      <input required name="attendancePercentage" value={form.attendancePercentage} onChange={update} type="number" min="40" max="100" placeholder="Attendance %" />
      <input required name="quizScore" value={form.quizScore} onChange={update} type="number" min="0" max="100" placeholder="Quiz Score" />
      <input required name="assignmentCompletion" value={form.assignmentCompletion} onChange={update} type="number" min="0" max="10" placeholder="Assignments (0-10)" />
      <input required name="numberOfAttempts" value={form.numberOfAttempts} onChange={update} type="number" min="1" max="5" placeholder="Attempts (1-5)" />
      <input required name="lessonCompletionPercentage" value={form.lessonCompletionPercentage} onChange={update} type="number" min="0" max="100" placeholder="Lesson Completion %" />
      <button className="btn-primary" disabled={loading} type="submit">{loading ? 'Predicting...' : 'Predict'}</button>
    </form>
  );
};

export default PredictForm;
