import { useState } from 'react';

const initialForm = {
  studentId: '',
  studyTime: '',
  attendancePercentage: '',
  quizScore: '',
  assignmentCompletion: '',
  numberOfAttempts: '',
  lessonCompletionPercentage: '',
};

const StudentForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  const fields = [
    { name: 'studentId', label: 'Student ID', type: 'text', min: null, max: null },
    { name: 'studyTime', label: 'Study Time (0-6 hrs)', type: 'number', min: 0, max: 6 },
    { name: 'attendancePercentage', label: 'Attendance %', type: 'number', min: 40, max: 100 },
    { name: 'quizScore', label: 'Quiz Score', type: 'number', min: 0, max: 100 },
    { name: 'assignmentCompletion', label: 'Assignment Completion (0-10)', type: 'number', min: 0, max: 10 },
    { name: 'numberOfAttempts', label: 'Number of Attempts (1-5)', type: 'number', min: 1, max: 5 },
    {
      name: 'lessonCompletionPercentage',
      label: 'Lesson Completion %',
      type: 'number',
      min: 0,
      max: 100,
    },
  ];

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Enter Student Academic Data</h2>
      {fields.map((field) => (
        <label key={field.name} className="form-row">
          <span>{field.label}</span>
          <input
            required
            name={field.name}
            type={field.type}
            value={form[field.name]}
            onChange={handleChange}
            min={field.min ?? undefined}
            max={field.max ?? undefined}
            step={field.type === 'number' ? 'any' : undefined}
            placeholder={field.label}
          />
        </label>
      ))}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict Performance'}
      </button>
    </form>
  );
};

export default StudentForm;
