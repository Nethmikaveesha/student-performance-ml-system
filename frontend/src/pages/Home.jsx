import { useState } from "react";

// Full CSS styles
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

  /* HERO IMAGE FULLSCREEN */
  .hero-image-fullscreen {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
  }
  .hero-image-fullscreen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.65);
  }
  .hero-text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    z-index: 2;
    padding: 0 24px;
  }
  .hero-text-overlay h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: 800;
    color: #f8fafc;
    text-shadow: 0 8px 30px rgba(0, 0, 0, 0.45), 0 0 18px rgba(99, 102, 241, 0.3);
    margin-bottom: 1rem;
  }
  .hero-text-overlay h1 em {
    background: linear-gradient(90deg, #00e6bf, #60a5fa, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-text-overlay p {
    font-size: 1.2rem;
    color: #c7d2fe;
    line-height: 1.7;
    font-weight: 400;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
    max-width: 600px;
    margin: 0 auto;
  }

  /* AUTH CARDS (dark themed) */
  .auth-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 24px; max-width: 860px; margin: 0 auto;
    padding: 80px 24px 40px;
  }
  @media(max-width:640px){ .auth-grid{ grid-template-columns:1fr; } }

  .auth-card {
    background: rgba(0,212,170,0.05); /* dark matching color */
    border: 1px solid rgba(0,212,170,0.25);
    border-radius: 20px; padding: 36px;
    backdrop-filter: blur(16px);
    transition: border-color 0.3s, transform 0.3s;
  }
  .auth-card:hover { border-color: rgba(0,212,170,0.35); transform: translateY(-2px); }
  .auth-card h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem; font-weight: 700; color: #fff;
    margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .auth-card .sub { font-size: 0.85rem; color: #94a3b8; margin-bottom: 28px; }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 0.78rem; color: #94a3b8; margin-bottom: 6px; }
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

  /* FEATURES */
  .features-section { padding: 0 24px 100px; max-width: 1000px; margin: 0 auto; }
  .section-label { text-align: center; font-size: 0.75rem; color: #00d4aa; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; margin-bottom: 12px; }
  .section-title { text-align: center; font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 700; color: #fff; letter-spacing: -0.03em; margin-bottom: 56px; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  @media(max-width:720px){ .features-grid{ grid-template-columns:1fr; } }
  @media(min-width:721px) and (max-width:900px){ .features-grid{ grid-template-columns:1fr 1fr; } }
  .feature-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; transition: border-color 0.3s; }
  .feature-card:hover { border-color: rgba(0,212,170,0.2); }
  .feature-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
  .feature-card h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .feature-card p { font-size: 0.85rem; color: #64748b; line-height: 1.6; }

  /* FOOTER */
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
  { icon: "🤖", color: "rgba(0,212,170,0.12)", label: "ML Prediction", desc: "Classify students as Weak, Average, or Strong based on real behavior data." },
  { icon: "📊", color: "rgba(99,102,241,0.12)", label: "Smart Analytics", desc: "Track study time, quiz scores, attendance, and assignment completion." },
  { icon: "🎓", color: "rgba(245,158,11,0.1)", label: "Student Dashboard", desc: "Personal dashboard with performance insights, trends, and tips." },
];

export default function Home() {
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "student" });
  const [regData, setRegData] = useState({ name: "", email: "", password: "", role: "student" });

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">

        {/* HERO IMAGE FULLSCREEN */}
        <div className="hero-image-fullscreen">
          <img src="/images/home-student-performance.png" alt="Student performance overview" />
          <div className="hero-text-overlay">
            <h1>Smart Student <em>Performance Prediction System</em></h1>
            <p>Analyze learning metrics and predict outcomes — Weak, Average, or Strong — before exams happen.</p>
          </div>
        </div>

        {/* AUTH CARDS */}
        <div className="auth-grid">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="sub">Sign in to your account</p>
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@school.edu" value={loginData.email} onChange={e => setLoginData({...loginData,email:e.target.value})}/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({...loginData,password:e.target.value})}/>
            </div>
            <div className="field">
              <label>Role</label>
              <select value={loginData.role} onChange={e => setLoginData({...loginData,role:e.target.value})}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn-primary">Sign In →</button>
          </div>

          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="sub">Join EduPredict</p>
            <div className="field">
              <label>Full Name</label>
              <input type="text" placeholder="Your Name" value={regData.name} onChange={e => setRegData({...regData,name:e.target.value})}/>
            </div>
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@school.edu" value={regData.email} onChange={e => setRegData({...regData,email:e.target.value})}/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="Create a strong password" value={regData.password} onChange={e => setRegData({...regData,password:e.target.value})}/>
            </div>
            <div className="field">
              <label>I am a...</label>
              <select value={regData.role} onChange={e => setRegData({...regData,role:e.target.value})}>
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
                <div className="feature-icon" style={{background:f.color}}>{f.icon}</div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div>© 2025 <span>EduPredict</span>. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}