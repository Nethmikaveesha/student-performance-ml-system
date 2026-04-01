import { useEffect, useMemo, useState } from "react";
import '../styles/ResultPage.css';

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

export default function ResultPage({
  result = "Strong",
  onBackToDashboard,
  onPredictAgain,
}) {
  const [animPct, setAnimPct] = useState(0);
  const [animMetrics, setAnimMetrics] = useState({});
  const r = result && configs[result] ? result : null;
  const cfg = r ? configs[r] : null;
  const data = r ? sampleData[r] : null;
  const generatedAt = useMemo(() => new Date().toLocaleString(), []);

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

  const downloadReport = () => {
    if (!r || !cfg) return;
    const rows = metrics.map((m) => `${m.label}: ${animMetrics[m.key] ?? 0}${m.unit}`);
    const content = [
      'EduPredict - Prediction Report',
      `Generated: ${generatedAt}`,
      `Result: ${r}`,
      `Badge: ${cfg.badge}`,
      '',
      'Key Metrics',
      ...rows,
      '',
      'Suggestions',
      ...cfg.suggestions.map((s, i) => `${i + 1}. ${s.text}`),
      '',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-report-${r.toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
<div className="rp-root">
        <div className="rp-bg" />
        <div className="rp-content">
          <nav>
            <div className="nav-logo">
              <div className="nav-logo-icon">🧠</div>
              EduPredict
            </div>
            <button className="nav-back" onClick={onBackToDashboard}>← Back to Dashboard</button>
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
                      <button className="btn-primary" onClick={onPredictAgain}>Predict Again</button>
                      <button className="btn-ghost" onClick={downloadReport}>Download Report</button>
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
                  <button className="btn-primary" onClick={onBackToDashboard}>Go to Dashboard</button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </>
  );
}