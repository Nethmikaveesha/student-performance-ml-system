import Login from '../components/Login';
import '../styles/Auth.css';

const LoginPage = ({ onLogin, setCurrentPage }) => {
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
          <button type="button" className="au-tab active">Sign In</button>
          <button type="button" className="au-tab" onClick={() => setCurrentPage('signup')}>Create Account</button>
        </div>
        <Login onLogin={onLogin} />
      </div>
    </section>
  );
};

export default LoginPage;
