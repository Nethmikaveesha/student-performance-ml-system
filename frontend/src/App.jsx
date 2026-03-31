import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ResultPage from './pages/ResultPage';
import { createQuiz, getPredictionHistory, predictPerformance } from './services/api';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { name: 'Student User', email: 'student@edupredict.com', password: 'student123', role: 'student' },
    { name: 'Teacher User', email: 'teacher@edupredict.com', password: 'teacher123', role: 'teacher' },
  ]);

  const loadHistory = async () => {
    try {
      const res = await getPredictionHistory();
      setHistory(res.data || []);
    } catch (_e) {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onPredict = async (payload) => {
    setLoading(true);
    try {
      const res = await predictPerformance(payload);
      setResult(res.model.prediction);
      setCurrentPage('result');
      await loadHistory();
    } finally {
      setLoading(false);
    }
  };

  const onQuizSubmit = async (quiz) => {
    await createQuiz(quiz);
  };

  const onRegister = async (payload) => {
    setUsers((prev) => [...prev, payload]);
    setCurrentPage('login');
  };

  const onLogin = async ({ email, password, role }) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === String(email).toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!found) return false;

    setCurrentUser(found);
    setCurrentPage(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    return true;
  };

  const renderPage = () => {
    if (currentPage === 'about') return <About />;
    if (currentPage === 'login') return <LoginPage onLogin={onLogin} setCurrentPage={setCurrentPage} />;
    if (currentPage === 'signup') return <SignupPage onRegister={onRegister} setCurrentPage={setCurrentPage} />;
    if (currentPage === 'student-dashboard') {
      return (
        <StudentDashboard
          onPredict={onPredict}
          onQuizSubmit={onQuizSubmit}
          loading={loading}
          currentUser={currentUser}
          predictionHistory={history}
        />
      );
    }
    if (currentPage === 'teacher-dashboard') return <TeacherDashboard history={history} currentUser={currentUser} />;
    if (currentPage === 'result') return <ResultPage result={result} />;
    return <Home />;
  };

  const hideChrome = currentPage === 'login' || currentPage === 'signup';

  return (
    <div className="app-shell">
      {!hideChrome && (
        <header className="app-header">
          <div className="container">
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </header>
      )}

      <main className="app-body">
        <div className="container page-content">{renderPage()}</div>
      </main>

      {!hideChrome && (
        <footer className="app-footer">
          <div className="container">
            <Footer />
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
