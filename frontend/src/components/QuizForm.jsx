import { useState } from 'react';

const QuizForm = ({ onQuizSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [quizScore, setQuizScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onQuizSubmit({ studentId, quizScore: Number(quizScore) });
    setQuizScore('');
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Quick Quiz Entry</h3>
      <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID" required />
      <input value={quizScore} onChange={(e) => setQuizScore(e.target.value)} placeholder="Quiz Score" type="number" min="0" max="100" required />
      <button className="btn-primary" type="submit">Save Quiz</button>
    </form>
  );
};

export default QuizForm;
