import Login from '../components/Login';
import Register from '../components/Register';

const Home = () => (
  <section className="grid-2">
    <div className="card">
      <h1>Student Performance Prediction</h1>
      <p>Analyze learning metrics and predict Weak, Average, or Strong outcomes.</p>
    </div>
    <Login />
    <Register />
  </section>
);

export default Home;
