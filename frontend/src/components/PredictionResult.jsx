const badgeClass = {
  Weak: 'badge weak',
  Average: 'badge average',
  Strong: 'badge strong',
};

const PredictionResult = ({ result }) => {
  if (!result) return null;

  return (
    <section className="card result-card">
      <h2>Prediction Result</h2>
      <p>
        Predicted Performance: <span className={badgeClass[result]}>{result}</span>
      </p>
    </section>
  );
};

export default PredictionResult;
