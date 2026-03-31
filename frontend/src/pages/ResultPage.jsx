import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #060c1a;
    color: #e2e8f0;
    position: relative;
    overflow-x: hidden;
    display: flex; flex-direction: column;
  }
  .rp-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 10% 10%, rgba(0,212,170,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 80%, rgba(99,102,241,0.08) 0%, transparent 60%);
  }
  .rp-bg::after {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 36px 36px;
  }
  .rp-content { position: relative; z-index: 1; flex: 1; }

  /* NAV */
  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,12,26,0.7); backdrop-filter: blur(12px);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
    color: #fff; display: flex; align-items: center; gap: 10px;
    letter-spacing: -0.03em;
  }
  .nav-logo-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #00d4aa, #6366f1);
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }
  .nav-back {
    display: flex; align-items: center; gap: 6px;
    color: #64748b; font-size: 0.85rem; cursor: pointer;
    transition: color 0.2s; border: none; background: none;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-back:hover { color: #00d4aa; }

  /* MAIN */
  .rp-main {
    max-width: 820px; margin: 0 auto;
    padding: 64px 24px;
  }

  .page-header { text-align: center; margin-bottom: 56px; }
  .page-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800; color: #fff; letter-spacing: -0.04em;
    margin-bottom: 10px;
  }
  .page-header p { color: #64748b; font-size: 0.95rem; }

  /* RESULT CARD */
  .result-card {
    border-radius: 24px;
    padding: 0;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 24px;
    animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .result-banner {
    padding: 48px 48px 40px;
    position: relative; overflow: hidden;
    display: flex; align-items: center; gap: 32px;
    flex-wrap: wrap;
  }
  /* Glow orb */
  .result-banner::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    filter: blur(60px); opacity: 0.35;
  }

  .result-banner.strong { background: linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.04)); border-bottom: 1px solid rgba(0,212,170,0.15); }
  .result-banner.strong::before { background: #00d4aa; }
  .result-banner.average { background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04)); border-bottom: 1px solid rgba(245,158,11,0.15); }
  .result-banner.average::before { background: #f59e0b; }
  .result-banner.weak { background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04)); border-bottom: 1px solid rgba(239,68,68,0.15); }
  .result-banner.weak::before { background: #ef4444; }

  .result-circle {
    position: relative; flex-shrink: 0;
  }
  .result-circle svg { transform: rotate(-90deg); }
  .result-circle-bg { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 6; }
  .result-circle-fg { fill: none; stroke-width: 6; stroke-linecap: round;
    transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1);
  }
  .strong .result-circle-fg { stroke: #00d4aa; }
  .average .result-circle-fg { stroke: #f59e0b; }
  .weak .result-circle-fg { stroke: #ef4444; }

  .result-circle-label {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    text-align: center;
  }
  .result-circle-pct {
    font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
    display: block; line-height: 1;
  }
  .strong .result-circle-pct { color: #00d4aa; }
  .average .result-circle-pct { color: #f59e0b; }
  .weak .result-circle-pct { color: #ef4444; }
  .result-circle-sublabel { font-size: 0.65rem; color: #64748b; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }

  .result-text { flex: 1; min-width: 200px; }
  .result-badge {
    display: inline-block; padding: 5px 14px; border-radius: 100px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 14px;
  }
  .strong .result-badge { background: rgba(0,212,170,0.15); color: #00d4aa; border: 1px solid rgba(0,212,170,0.3); }
  .average .result-badge { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .weak .result-badge { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }

  .result-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 800; color: #fff; letter-spacing: -0.04em;
    margin-bottom: 10px;
  }
  .result-desc { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; max-width: 380px; }

  .result-body { padding: 36px 48px; background: rgba(255,255,255,0.015); }

  /* METRICS */
  .metrics-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
    margin-bottom: 32px;
  }
  @media(max-width:600px){ .metrics-grid{ grid-template-columns:1fr 1fr; } }
  .metric-chip {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 18px 16px;
  }
  .metric-chip-label { font-size: 0.72rem; color: #64748b; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; }
  .metric-chip-val {
    font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em;
  }
  .metric-bar { margin-top: 8px; height: 3px; border-radius: 100px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .metric-bar-fill { height: 100%; border-radius: 100px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* SUGGESTIONS */
  .suggestions-title {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: #fff; margin-bottom: 16px; letter-spacing: -0.01em;
  }
  .suggestions-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .suggestions-list li {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 16px;
    font-size: 0.88rem; color: #94a3b8; line-height: 1.5;
  }
  .sug-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

  /* EMPTY STATE */
  .empty-state {
    text-align: center; padding: 80px 24px;
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 24px;
  }
  .empty-icon { font-size: 52px; margin-bottom: 20px; opacity: 0.4; }
  .empty-state h3 {
    font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700;
    color: #fff; margin-bottom: 10px;
  }
  .empty-state p { color: #475569; font-size: 0.9rem; }

  /* ACTION BUTTONS */
  .actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
  .btn-primary {
    padding: 12px 24px;
    background: linear-gradient(135deg, #00d4aa, #00b894);
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
    color: #060c1a; cursor: pointer; letter-spacing: 0.01em;
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-ghost {
    padding: 12px 24px;
    background: transparent; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700;
    color: #94a3b8; cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

  footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 24px 48px; color: #334155; font-size: 0.8rem;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  }
  footer span { color: #00d4aa; }
`;

const configs = {
  Strong: {
    cls: "strong", pct: 92, color: "#00d4aa",
    badge: "Excellent Performance",
    desc: "You're performing at the top tier. Your study habits, engagement, and scores place you in the strongest category. Keep up the outstanding work!",
    suggestions: [
      { icon: "🏆", text: "Consider mentoring peers — teaching reinforces your own understanding." },
      { icon: "📈", text: "Challenge yourself with advanced topics beyond the syllabus." },
      { icon: "🔬", text: "Explore research opportunities or competitive academic events." },
    ]
  },
  Average: {
    cls: "average", pct: 61, color: "#f59e0b",
    badge: "Average Performance",
    desc: "You're performing at a solid baseline. With targeted improvements to your study habits and consistency, you have strong potential to reach the top tier.",
    suggestions: [
      { icon: "⏰", text: "Increase daily study time by 30–45 minutes, focusing on weak subjects first." },
      { icon: "📝", text: "Improve assignment completion rates — missing work affects your overall score significantly." },
      { icon: "🔄", text: "Re-attempt quizzes you didn't score well on to reinforce memory." },
    ]
  },
  Weak: {
    cls: "weak", pct: 28, color: "#ef4444",
    badge: "Needs Improvement",
    desc: "Your current performance signals some areas of concern. Don't worry — identifying this early means you have time to turn things around with focused effort.",
    suggestions: [
      { icon: "🆘", text: "Speak to your teacher immediately — personalised support can make a big difference." },
      { icon: "📅", text: "Create a strict daily study schedule and stick to it for at least 21 days." },
      { icon: "🎯", text: "Focus on attendance first — presence in class is the #1 predictor of improvement." },
    ]
  },
};

const metrics = [
  { label: "Study Time", key: "studyTime", unit: "hrs/day", max: 8 },
  { label: "Quiz Score", key: "quizScore", unit: "%", max: 100 },
  { label: "Attendance", key: "attendance", unit: "%", max: 100 },
  { label: "Assignments", key: "assignments", unit: "%", max: 100 },
  { label: "Lesson Done", key: "lessons", unit: "%", max: 100 },
  { label: "Quiz Attempts", key: "attempts", unit: "×", max: 10 },
];

const sampleData = {
  Strong:  { studyTime: 6, quizScore: 91, attendance: 95, assignments: 98, lessons: 92, attempts: 8 },
  Average: { studyTime: 4, quizScore: 63, attendance: 74, assignments: 70, lessons: 65, attempts: 5 },
  Weak:    { studyTime: 1, quizScore: 28, attendance: 45, assignments: 40, lessons: 30, attempts: 2 },
};

export default function ResultPage({ result = "Strong" }) {
  const [animPct, setAnimPct] = useState(0);
  const [animMetrics, setAnimMetrics] = useState({});
  const r = result && configs[result] ? result : null;
  const cfg = r ? configs[r] : null;
  const data = r ? sampleData[r] : null;

  const R = 52, C = 2 * Math.PI * R;

  useEffect(() => {
    if (!cfg) return;
    const t = setTimeout(() => setAnimPct(cfg.pct), 200);
    const m = {};
    if (data) Object.keys(data).forEach(k => { m[k] = data[k]; });
    const t2 = setTimeout(() => setAnimMetrics(m), 300);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [result]);

  const offset = C - (animPct / 100) * C;

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">
        <div className="rp-bg" />
        <div className="rp-content">
          <nav>
            <div className="nav-logo">
              <div className="nav-logo-icon">🧠</div>
              EduPredict
            </div>
            <button className="nav-back">← Back to Dashboard</button>
          </nav>

          <main className="rp-main">
            <div className="page-header">
              <h1>Prediction Result</h1>
              <p>Based on your submitted academic performance data</p>
            </div>

            {r ? (
              <>
                <div className={`result-card`}>
                  <div className={`result-banner ${cfg.cls}`}>
                    {/* Circle gauge */}
                    <div className="result-circle">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle className="result-circle-bg" cx="60" cy="60" r={R} />
                        <circle
                          className="result-circle-fg"
                          cx="60" cy="60" r={R}
                          strokeDasharray={C}
                          strokeDashoffset={offset}
                        />
                      </svg>
                      <div className="result-circle-label">
                        <span className="result-circle-pct">{animPct}%</span>
                        <span className="result-circle-sublabel">Score</span>
                      </div>
                    </div>
                    {/* Text */}
                    <div className="result-text">
                      <div className="result-badge">{cfg.badge}</div>
                      <div className="result-name">{r} Student</div>
                      <p className="result-desc">{cfg.desc}</p>
                    </div>
                  </div>

                  <div className="result-body">
                    {/* Metrics */}
                    <div className="metrics-grid">
                      {metrics.map(m => {
                        const val = animMetrics[m.key] ?? 0;
                        const pct = (val / m.max) * 100;
                        return (
                          <div className="metric-chip" key={m.key}>
                            <div className="metric-chip-label">{m.label}</div>
                            <div className="metric-chip-val">{val}{m.unit}</div>
                            <div className="metric-bar">
                              <div className="metric-bar-fill"
                                style={{ width: `${pct}%`, background: cfg.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Suggestions */}
                    <div className="suggestions-title">💡 Personalized Suggestions</div>
                    <ul className="suggestions-list">
                      {cfg.suggestions.map((s, i) => (
                        <li key={i}>
                          <span className="sug-icon">{s.icon}</span>
                          {s.text}
                        </li>
                      ))}
                    </ul>

                    <div className="actions">
                      <button className="btn-primary">Predict Again</button>
                      <button className="btn-ghost">Download Report</button>
                    </div>
                  </div>
                </div>

                {/* Toggle demo */}
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  {["Strong","Average","Weak"].map(v => (
                    <button key={v}
                      onClick={() => { setAnimPct(0); setAnimMetrics({}); }}
                      style={{
                        padding:"8px 18px", borderRadius:100,
                        border:`1px solid ${v===result?"rgba(0,212,170,0.4)":"rgba(255,255,255,0.1)"}`,
                        background: v===result?"rgba(0,212,170,0.1)":"transparent",
                        color: v===result?"#00d4aa":"#64748b",
                        fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem", cursor:"pointer"
                      }}>
                      {v}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔮</div>
                <h3>No Prediction Yet</h3>
                <p>Submit your academic data from the dashboard to see your prediction here.</p>
                <div className="actions" style={{ justifyContent:"center" }}>
                  <button className="btn-primary">Go to Dashboard</button>
                </div>
              </div>
            )}
          </main>

          <footer>
            <div>© 2025 <span>EduPredict</span></div>
            <div>Predictions are powered by ML — not a substitute for teacher feedback</div>
          </footer>
        </div>
      </div>
    </>
  );
}