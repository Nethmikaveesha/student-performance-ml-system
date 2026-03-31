const About = () => {
  return (
    <section className="about-page">
      <div className="about-hero">
        <p className="about-kicker">About EduPredict</p>
        <h1>Smart Student Performance Prediction System</h1>
        <p className="about-intro">
          EduPredict combines machine learning and modern web technology to forecast student
          performance and provide early insights for timely academic support.
        </p>
      </div>

      <div className="about-grid">
        <article className="about-block">
          <h3>What We Solve</h3>
          <p>
            Students often receive support too late. EduPredict helps identify weak, average,
            and strong performance patterns early using real learning behavior data.
          </p>
        </article>

        <article className="about-block">
          <h3>How It Works</h3>
          <p>
            The React frontend collects inputs, Node.js/Express handles APIs, MongoDB stores
            records, and a Python Scikit-learn model generates prediction outcomes.
          </p>
        </article>

        <article className="about-block">
          <h3>Key Inputs</h3>
          <p>
            Study time, attendance, quiz score, assignment completion, attempts, and lesson
            completion are used to estimate likely academic performance.
          </p>
        </article>
      </div>

      <div className="about-highlights">
        <div className="highlight-card">
          <h4>Why EduPredict</h4>
          <ul>
            <li>Early intervention for at-risk students</li>
            <li>Data-driven support for teachers</li>
            <li>Clear progress visibility for learners</li>
          </ul>
        </div>
        <div className="highlight-card">
          <h4>Future Roadmap</h4>
          <ul>
            <li>Personalized study recommendations</li>
            <li>Classroom trend visual analytics</li>
            <li>Adaptive model retraining workflows</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;