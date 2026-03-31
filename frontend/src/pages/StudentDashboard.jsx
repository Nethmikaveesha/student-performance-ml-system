import PredictForm from '../components/PredictForm';
import QuizForm from '../components/QuizForm';

const StudentDashboard = ({ onPredict, onQuizSubmit, loading }) => (
  <section className="grid-2">
    <PredictForm onPredict={onPredict} loading={loading} />
    <QuizForm onQuizSubmit={onQuizSubmit} />
  </section>
);

export default StudentDashboard;
