import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login demo: ${email}`);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button className="btn-primary" type="submit">Login</button>
    </form>
  );
};

export default Login;
