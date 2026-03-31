import '../styles/Home.css';

const features = [
  { icon: "🤖", color: "rgba(0,212,170,0.12)", label: "ML Prediction", desc: "Classify students as Weak, Average, or Strong based on real behavior data." },
  { icon: "📊", color: "rgba(99,102,241,0.12)", label: "Smart Analytics", desc: "Track study time, quiz scores, attendance, and assignment completion." },
  { icon: "🎓", color: "rgba(245,158,11,0.1)", label: "Student Dashboard", desc: "Personal dashboard with performance insights, trends, and tips." },
];

export default function Home() {
  return (
    <div className="hp-root">

        {/* HERO IMAGE FULLSCREEN */}
        <div className="hero-image-fullscreen">
          <img src="/images/home-student-performance.png" alt="Student performance overview" />
          <div className="hero-text-overlay">
            <h1>Smart Student <em>Performance Prediction System</em></h1>
            <p>Analyze learning metrics and predict outcomes  Weak, Average, or Strong before exams happen.</p>
          </div>
        </div>

        {/* FEATURES */}
        <section className="features-section">
          <p className="section-label">What We Offer</p>
          <h2 className="section-title">Everything in one intelligent platform</h2>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.label}>
                <div className="feature-icon" style={{background:f.color}}>{f.icon}</div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

    </div>
  );
}