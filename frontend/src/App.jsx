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
import { createQuiz, getPredictionHistory, getStudents, loginUser, predictPerformance, registerUser } from './services/api';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);

  const loadHistory = async () => {
    try {
      const res = await getPredictionHistory();
      setHistory(res.data || []);
    } catch (_e) {
      setHistory([]);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data || []);
    } catch (_e) {
      setStudents([]);
    }
  };

  useEffect(() => {
    loadHistory();
    loadStudents();
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
    try {
      await registerUser(payload);
      setCurrentPage('login');
      return { ok: true, message: '' };
    } catch (error) {
      return {
        ok: false,
        message: error?.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const onLogin = async ({ email, password, role }) => {
    try {
      const response = await loginUser({ email, password, role });
      const found = response.data;
      if (!found) return false;

      setCurrentUser(found);
      setCurrentPage(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
      return true;
    } catch (_error) {
      return false;
    }
  };

  const onLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'about') return <About />;
    if (currentPage === 'login') return <LoginPage onLogin={onLogin} setCurrentPage={setCurrentPage} />;
    if (currentPage === 'signup') return <SignupPage onRegister={onRegister} setCurrentPage={setCurrentPage} />;
    if (
      currentPage === 'student-dashboard' ||
      currentPage === 'student-predict' ||
      currentPage === 'student-quizzes' ||
      currentPage === 'student-progress' ||
      currentPage === 'student-suggestions' ||
      currentPage === 'student-settings'
    ) {
      const sectionMap = {
        'student-dashboard': 'dashboard',
        'student-predict': 'predict',
        'student-quizzes': 'quizzes',
        'student-progress': 'progress',
        'student-suggestions': 'suggestions',
        'student-settings': 'settings',
      };
      return (
        <StudentDashboard
          onPredict={onPredict}
          onQuizSubmit={onQuizSubmit}
          loading={loading}
          currentUser={currentUser}
          predictionHistory={history}
          currentSection={sectionMap[currentPage]}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
        />
      );
    }
    if (
      currentPage === 'teacher-dashboard' ||
      currentPage === 'teacher-overview' ||
      currentPage === 'teacher-allstudents' ||
      currentPage === 'teacher-atrisk' ||
      currentPage === 'teacher-analytics' ||
      currentPage === 'teacher-reports' ||
      currentPage === 'teacher-settings'
    ) {
      const sectionMap = {
        'teacher-dashboard': 'overview',
        'teacher-overview': 'overview',
        'teacher-allstudents': 'allstudents',
        'teacher-atrisk': 'atrisk',
        'teacher-analytics': 'analytics',
        'teacher-reports': 'reports',
        'teacher-settings': 'settings',
      };
      return (
        <TeacherDashboard
          history={history}
          currentUser={currentUser}
          students={students}
          currentSection={sectionMap[currentPage]}
          onNavigate={setCurrentPage}
          onLogout={onLogout}
        />
      );
    }
    if (currentPage === 'result') return <ResultPage result={result} />;
    return <Home />;
  };

  const hideChrome =
    currentPage === 'login' ||
    currentPage === 'signup' ||
    currentPage.startsWith('student-') ||
    currentPage.startsWith('teacher-');

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
