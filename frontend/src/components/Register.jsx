import { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');

  return (
    <form className="card form-grid" onSubmit={(e) => e.preventDefault()}>
      <h3>Register</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
      <input placeholder="Email" required />
      <input placeholder="Password" type="password" required />
      <button className="btn-primary" type="submit">Create Account</button>
    </form>
  );
};

export default Register;
