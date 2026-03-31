import { useState } from 'react';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = await onRegister?.({ name, email, password, role });
    if (!result?.ok) {
      setError(result?.message || 'Registration failed.');
      return;
    }
    setMessage('Account created. You can now login.');
  };

  return (
    <form className="au-form" onSubmit={handleSubmit}>
      <div>
        <p className="au-label">Full Name</p>
        <div className="au-input-wrap">
          <span>👤</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
        </div>
      </div>

      <div>
        <p className="au-label">Email Address</p>
        <div className="au-input-wrap">
          <span>✉️</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@demo.com" required />
        </div>
      </div>

      <div>
        <p className="au-label">Password</p>
        <div className="au-input-wrap">
          <span>🔒</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" required />
        </div>
      </div>

      <div>
        <p className="au-label">Select Role</p>
        <div className="au-role-grid">
          <button type="button" className={role === 'student' ? 'au-role-btn active' : 'au-role-btn'} onClick={() => setRole('student')}>🎓 Student</button>
          <button type="button" className={role === 'teacher' ? 'au-role-btn active' : 'au-role-btn'} onClick={() => setRole('teacher')}>👩‍🏫 Teacher</button>
        </div>
      </div>

      {error && <p className="au-msg-error">{error}</p>}
      {message && <p className="au-msg-success">{message}</p>}
      <button className="au-submit" type="submit">Create Account →</button>
    </form>
  );
};

export default Register;
