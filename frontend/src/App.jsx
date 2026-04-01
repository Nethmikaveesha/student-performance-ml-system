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
import {
  apiErrorMessage,
  clearAuth,
  createQuiz,
  extractAuthFromBody,
  getPredictionHistory,
  getStoredAuth,
  getStudents,
  loginUser,
  persistAuth,
  predictPerformance,
  registerUser,
  setAuthToken,
} from './services/api';
import './App.css';

function initialPage() {
  const u = getStoredAuth()?.user;
  if (u?.role === 'teacher') return 'teacher-dashboard';
  if (u?.role === 'student') return 'student-dashboard';
  return 'home';
}

const App = () => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictError, setPredictError] = useState('');
  const [quizApiError, setQuizApiError] = useState('');
  const [currentUser, setCurrentUser] = useState(() => getStoredAuth()?.user ?? null);
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
    const s = getStoredAuth();
    if (!s?.token || !s?.user) return;
    setAuthToken(s.token);
    loadHistory();
    if (s.user.role === 'teacher') loadStudents();
  }, []);

  const onPredict = async (payload) => {
    setPredictError('');
    setLoading(true);
    try {
      const res = await predictPerformance(payload);
      setResult(res.model.prediction);
      setCurrentPage('result');
      await loadHistory();
    } catch (error) {
      setPredictError(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onQuizSubmit = async (quiz) => {
    setQuizApiError('');
    try {
      await createQuiz(quiz);
      if (currentUser?.role === 'teacher') await loadStudents();
    } catch (error) {
      setQuizApiError(apiErrorMessage(error));
      throw error;
    }
  };

  const onRegister = async (payload) => {
    try {
      await registerUser(payload);
      setCurrentPage('login');
      return { ok: true, message: '' };
    } catch (error) {
      return {
        ok: false,
        message: apiErrorMessage(error),
      };
    }
  };

  const onLogin = async ({ email, password, role }) => {
    try {
      const body = await loginUser({ email, password, role });
      const auth = extractAuthFromBody(body);
      if (!auth?.token) {
        return {
          ok: false,
          message:
            'No session token from the server. Set VITE_API_BASE_URL to your API root ending in /api (example: http://localhost:5000/api), restart the backend, and try again.',
        };
      }
      const { token, user } = auth;
      persistAuth(user, token);
      setCurrentUser(user);
      setCurrentPage(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
      await loadHistory();
      if (role === 'teacher') await loadStudents();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: apiErrorMessage(error),
      };
    }
  };

  const onLogout = () => {
    clearAuth();
    setCurrentUser(null);
    setHistory([]);
    setStudents([]);
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
          predictError={predictError}
          onClearPredictError={() => setPredictError('')}
          quizApiError={quizApiError}
          onClearQuizApiError={() => setQuizApiError('')}
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
    if (currentPage === 'result') {
      const studentHomePage = currentUser?.role === 'student' ? 'student-dashboard' : 'home';
      return (
        <ResultPage
          result={result}
          onBackToDashboard={() => setCurrentPage(studentHomePage)}
          onPredictAgain={() => setCurrentPage('student-predict')}
        />
      );
    }
    return <Home />;
  };

  const hideChrome =
    currentPage === 'login' ||
    currentPage === 'signup' ||
    currentPage === 'result' ||
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
