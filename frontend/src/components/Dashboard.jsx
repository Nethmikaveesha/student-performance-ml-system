const Dashboard = ({ history }) => {
  return (
    <section className="card">
      <h3>Dashboard Snapshot</h3>
      <p>Total recent predictions: {history.length}</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Prediction</th><th>Quiz</th></tr></thead>
          <tbody>
            {history.slice(0, 10).map((item) => (
              <tr key={item._id}><td>{item.studentId}</td><td>{item.prediction}</td><td>{item.quizScore}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
