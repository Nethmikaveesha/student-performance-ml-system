import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await onLogin?.({ email, password, role });
    if (!result?.ok) {
      setError(result?.message || 'Sign in failed. Check your email, password, and role.');
    }
  };

  return (
    <form className="au-form" onSubmit={handleSubmit}>
      <div>
        <p className="au-label">Email Address</p>
        <div className="au-input-wrap">
          <span>✉️</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" required />
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
      <button className="au-submit" type="submit">Sign In →</button>
    </form>
  );
};

export default Login;
