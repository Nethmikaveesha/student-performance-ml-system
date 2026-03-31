import Register from '../components/Register';
import '../styles/Auth.css';

const SignupPage = ({ onRegister, setCurrentPage }) => {
  return (
    <section className="au-shell">
      <div className="au-card">
        <button type="button" className="au-back-home" onClick={() => setCurrentPage('home')}>
          ← Back to Home
        </button>
        <div className="au-header">
          <h1>EduPredict </h1>
          <p>Smart Student Performance Prediction System</p>
        </div>
        <div className="au-tabs">
          <button type="button" className="au-tab" onClick={() => setCurrentPage('login')}>Sign In</button>
          <button type="button" className="au-tab active">Create Account</button>
        </div>
        <Register onRegister={onRegister} />
      </div>
    </section>
  );
};

export default SignupPage;
