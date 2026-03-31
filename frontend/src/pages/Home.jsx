import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #060c1a;
    color: #e2e8f0;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Mesh background ── */
  .hp-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 10% 10%, rgba(0,212,170,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 60% at 90% 80%, rgba(99,102,241,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,12,26,0) 0%, #060c1a 100%);
  }

  /* grid dots */
  .hp-bg::after {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 36px 36px;
  }

  .hp-content { position: relative; z-index: 1; }

  /* ── NAV ── */
  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 99;
    background: rgba(6,12,26,0.7);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, #00d4aa, #6366f1);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .nav-pill {
    background: rgba(0,212,170,0.1);
    border: 1px solid rgba(0,212,170,0.25);
    color: #00d4aa;
    padding: 6px 14px; border-radius: 100px;
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.05em;
  }

  /* ── HERO ── */
  .hero {
    text-align: center;
    padding: 96px 24px 64px;
    max-width: 860px; margin: 0 auto;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,212,170,0.08);
    border: 1px solid rgba(0,212,170,0.2);
    border-radius: 100px; padding: 8px 18px;
    font-size: 0.78rem; color: #00d4aa; font-weight: 500;
    margin-bottom: 32px;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .hero-badge span { width: 6px; height: 6px; border-radius: 50%; background: #00d4aa;
    display: inline-block; animation: pulse 2s infinite; }
  @keyframes pulse {
    0%,100%{ opacity:1; transform:scale(1); }
    50%{ opacity:0.5; transform:scale(1.4); }
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -0.04em;
    color: #fff; margin-bottom: 24px;
  }
  .hero h1 em {
    font-style: normal;
    background: linear-gradient(90deg, #00d4aa, #6366f1);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p {
    font-size: 1.15rem; color: #94a3b8; line-height: 1.7; font-weight: 300;
    max-width: 520px; margin: 0 auto 48px;
  }

  /* ── STATS ROW ── */
  .stats-row {
    display: flex; justify-content: center; gap: 48px;
    padding: 0 24px 80px;
    flex-wrap: wrap;
  }
  .stat { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem; font-weight: 800; color: #fff;
    letter-spacing: -0.04em;
  }
  .stat-num span { color: #00d4aa; }
  .stat-label { font-size: 0.8rem; color: #64748b; margin-top: 4px; letter-spacing: 0.04em; text-transform: uppercase; }

  /* ── AUTH CARDS ── */
  .auth-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 24px; max-width: 860px; margin: 0 auto;
    padding: 0 24px 80px;
  }
  @media(max-width:640px){ .auth-grid{ grid-template-columns:1fr; } }

  .auth-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 36px;
    backdrop-filter: blur(16px);
    transition: border-color 0.3s, transform 0.3s;
  }
  .auth-card:hover { border-color: rgba(0,212,170,0.25); transform: translateY(-2px); }
  .auth-card h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem; font-weight: 700; color: #fff;
    margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .auth-card .sub { font-size: 0.85rem; color: #64748b; margin-bottom: 28px; }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 0.78rem; color: #94a3b8; margin-bottom: 6px; letter-spacing: 0.03em; }
  .field input, .field select {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 11px 14px;
    color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field input:focus, .field select:focus {
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0,212,170,0.12);
  }
  .field input::placeholder { color: #475569; }

  .btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #00d4aa, #00b894);
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
    color: #060c1a; cursor: pointer; letter-spacing: 0.01em;
    transition: opacity 0.2s, transform 0.15s;
    margin-top: 4px;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-secondary {
    width: 100%; padding: 13px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
    color: #a5b4fc; cursor: pointer; letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.15s;
    margin-top: 4px;
  }
  .btn-secondary:hover { background: rgba(99,102,241,0.2); transform: translateY(-1px); }

  /* ── FEATURES ── */
  .features-section { padding: 0 24px 100px; max-width: 1000px; margin: 0 auto; }
  .section-label {
    text-align: center; font-size: 0.75rem; color: #00d4aa;
    letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;
    margin-bottom: 12px;
  }
  .section-title {
    text-align: center;
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 700; color: #fff; letter-spacing: -0.03em;
    margin-bottom: 56px;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media(max-width:720px){ .features-grid{ grid-template-columns:1fr; } }
  @media(min-width:721px) and (max-width:900px){ .features-grid{ grid-template-columns:1fr 1fr; } }

  .feature-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 28px;
    transition: border-color 0.3s;
  }
  .feature-card:hover { border-color: rgba(0,212,170,0.2); }
  .feature-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 16px;
  }
  .feature-card h3 {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: #fff; margin-bottom: 8px; letter-spacing: -0.01em;
  }
  .feature-card p { font-size: 0.85rem; color: #64748b; line-height: 1.6; }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 28px 48px;
    display: flex; align-items: center; justify-content: space-between;
    color: #334155; font-size: 0.8rem;
    flex-wrap: wrap; gap: 12px;
  }
  footer span { color: #00d4aa; }
`;

const features = [
  { icon: "🤖", color: "rgba(0,212,170,0.12)", label: "ML Prediction", desc: "Scikit-learn model classifies students as Weak, Average, or Strong based on real behavior data." },
  { icon: "📊", color: "rgba(99,102,241,0.12)", label: "Smart Analytics", desc: "Real-time tracking of study time, quiz scores, attendance, and assignment completion." },
  { icon: "🎓", color: "rgba(245,158,11,0.1)", label: "Student Dashboard", desc: "Personal dashboard with performance insights, trends, and personalized improvement tips." },
  { icon: "👩‍🏫", color: "rgba(239,68,68,0.1)", label: "Teacher View", desc: "Identify at-risk students instantly and monitor performance trends across the class." },
  { icon: "⚡", color: "rgba(0,212,170,0.12)", label: "Instant Results", desc: "Enter your academic data and get a prediction in milliseconds — no waiting." },
  { icon: "🔄", color: "rgba(99,102,241,0.12)", label: "Self-Improving", desc: "The system learns continuously as new student data is fed back into the training pipeline." },
];

export default function Home() {
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "student" });
  const [regData, setRegData] = useState({ name: "", email: "", password: "", role: "student" });

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">
        <div className="hp-bg" />
        <div className="hp-content">
          {/* NAV */}
          <nav>
            <div className="nav-logo">
              <div className="nav-logo-icon">🧠</div>
              EduPredict
            </div>
            <div className="nav-pill">AI-Powered</div>
          </nav>

          {/* HERO */}
          <section className="hero">
            <div className="hero-badge"><span />Live Prediction Engine Active</div>
            <h1>Predict Student<br /><em>Performance</em><br />with AI</h1>
            <p>Analyze learning metrics and predict outcomes — Weak, Average, or Strong — before exams happen. Empower students and teachers alike.</p>
          </section>

          {/* STATS */}
          <div className="stats-row">
            {[["98%","Accuracy"],["3","Outcome Tiers"],["6","Data Metrics"],["∞","Self-Learning"]].map(([n,l]) => (
              <div className="stat" key={l}>
                <div className="stat-num">{n.replace("8","8")}<span>{n.includes("%")?"":""}</span></div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>

          {/* AUTH CARDS */}
          <div className="auth-grid">
            {/* Login */}
            <div className="auth-card">
              <h2>Welcome Back</h2>
              <p className="sub">Sign in to your account to continue</p>
              <div className="field">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="you@school.edu"
                  value={loginData.email}
                  onChange={e => setLoginData({...loginData, email: e.target.value})} />
              </div>
              <div className="field">
                <label>PASSWORD</label>
                <input type="password" placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})} />
              </div>
              <div className="field">
                <label>ROLE</label>
                <select value={loginData.role}
                  onChange={e => setLoginData({...loginData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="btn-primary">Sign In →</button>
            </div>

            {/* Register */}
            <div className="auth-card">
              <h2>Create Account</h2>
              <p className="sub">Join EduPredict and start tracking your growth</p>
              <div className="field">
                <label>FULL NAME</label>
                <input type="text" placeholder="Your Name"
                  value={regData.name}
                  onChange={e => setRegData({...regData, name: e.target.value})} />
              </div>
              <div className="field">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="you@school.edu"
                  value={regData.email}
                  onChange={e => setRegData({...regData, email: e.target.value})} />
              </div>
              <div className="field">
                <label>PASSWORD</label>
                <input type="password" placeholder="Create a strong password"
                  value={regData.password}
                  onChange={e => setRegData({...regData, password: e.target.value})} />
              </div>
              <div className="field">
                <label>I AM A...</label>
                <select value={regData.role}
                  onChange={e => setRegData({...regData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <button className="btn-secondary">Create Account →</button>
            </div>
          </div>

          {/* FEATURES */}
          <section className="features-section">
            <p className="section-label">What We Offer</p>
            <h2 className="section-title">Everything in one intelligent platform</h2>
            <div className="features-grid">
              {features.map(f => (
                <div className="feature-card" key={f.label}>
                  <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                  <h3>{f.label}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer>
            <div>© 2025 <span>EduPredict</span>. All rights reserved.</div>
            <div>Powered by Scikit-learn · MongoDB · React</div>
          </footer>
        </div>
      </div>
    </>
  );
}