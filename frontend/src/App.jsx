import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
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

  const renderPage = () => {
    if (currentPage === 'student') return <StudentDashboard onPredict={onPredict} onQuizSubmit={onQuizSubmit} loading={loading} />;
    if (currentPage === 'teacher') return <TeacherDashboard history={history} />;
    if (currentPage === 'result') return <ResultPage result={result} />;
    return <Home />;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </header>

      <main className="app-body">
        <div className="container page-content">{renderPage()}</div>
      </main>
    </div>
  );
};

export default App;
