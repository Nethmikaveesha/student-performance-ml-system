const ResultPage = ({ result }) => (
  <section className="card">
    <h2>Prediction Result</h2>
    {result ? <p>Current prediction: <strong>{result}</strong></p> : <p>No prediction yet.</p>}
  </section>
);

export default ResultPage;
