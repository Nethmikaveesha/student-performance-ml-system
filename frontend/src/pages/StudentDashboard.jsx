import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sd-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #060c1a;
    color: #e2e8f0;
    display: flex;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: rgba(255,255,255,0.025);
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
    color: #fff; letter-spacing: -0.03em;
  }
  .sidebar-logo-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #00d4aa, #6366f1);
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }
  .sidebar-section {
    padding: 20px 16px 8px;
    font-size: 0.68rem; color: #475569;
    letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;
  }
  .sidebar-nav { padding: 0 8px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; margin-bottom: 2px;
    font-size: 0.88rem; color: #64748b; cursor: pointer;
    transition: background 0.2s, color 0.2s; border: none;
    background: none; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
  .nav-item.active {
    background: rgba(0,212,170,0.1); color: #00d4aa;
    font-weight: 500;
  }
  .nav-icon { font-size: 15px; }
  .sidebar-user {
    padding: 16px; margin: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .user-name { font-size: 0.85rem; font-weight: 500; color: #e2e8f0; }
  .user-role { font-size: 0.72rem; color: #475569; }

  /* ── MAIN ── */
  .sd-main { flex: 1; overflow-y: auto; }

  /* TOP BAR */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 36px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,12,26,0.5); backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 10;
  }
  .topbar-title h2 {
    font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800;
    color: #fff; letter-spacing: -0.03em;
  }
  .topbar-title p { font-size: 0.82rem; color: #475569; margin-top: 2px; }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }
  .badge-notif {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; position: relative;
  }
  .badge-notif::after {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: #00d4aa; border: 2px solid #060c1a;
    position: absolute; top: 6px; right: 6px;
  }
  .btn-predict {
    padding: 10px 20px;
    background: linear-gradient(135deg, #00d4aa, #00b894);
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700;
    color: #060c1a; cursor: pointer; letter-spacing: 0.01em;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-predict:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── BODY ── */
  .sd-body { padding: 32px 36px; }

  /* STAT CARDS */
  .stat-cards {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  @media(max-width:900px){ .stat-cards{ grid-template-columns:1fr 1fr; } }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 22px 20px;
    transition: border-color 0.3s, transform 0.2s;
  }
  .stat-card:hover { border-color: rgba(0,212,170,0.2); transform: translateY(-2px); }
  .stat-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .stat-card-icon { font-size: 20px; }
  .stat-card-trend {
    font-size: 0.72rem; padding: 3px 8px; border-radius: 100px;
    font-weight: 500;
  }
  .trend-up { background: rgba(0,212,170,0.12); color: #00d4aa; }
  .trend-down { background: rgba(239,68,68,0.12); color: #ef4444; }
  .stat-card-val {
    font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800;
    color: #fff; letter-spacing: -0.04em; margin-bottom: 4px;
  }
  .stat-card-label { font-size: 0.78rem; color: #64748b; }

  /* ── GRID ── */
  .content-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width:800px){ .content-grid{ grid-template-columns: 1fr; } }

  .panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; overflow: hidden;
  }
  .panel-header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-header h3 {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em;
  }
  .panel-header span { font-size: 0.78rem; color: #475569; }
  .panel-body { padding: 24px; }

  /* PREDICT FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field { margin-bottom: 0; }
  .field label {
    display: block; font-size: 0.72rem; color: #64748b;
    margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .field input, .field select {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 12px;
    color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field input:focus, .field select:focus {
    border-color: #00d4aa; box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }
  .field input::placeholder { color: #334155; }
  .slider-wrapper { padding: 4px 0; }
  .slider-row { display: flex; align-items: center; gap: 12px; }
  input[type=range] {
    flex: 1; -webkit-appearance: none; appearance: none;
    background: rgba(255,255,255,0.08); height: 4px; border-radius: 100px;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
    background: #00d4aa; cursor: pointer;
    box-shadow: 0 0 8px rgba(0,212,170,0.5);
  }
  .slider-val {
    font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700;
    color: #00d4aa; min-width: 36px; text-align: right;
  }
  .btn-full {
    width: 100%; margin-top: 18px; padding: 12px;
    background: linear-gradient(135deg, #00d4aa, #00b894);
    border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700;
    color: #060c1a; cursor: pointer; letter-spacing: 0.01em;
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-full:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-full:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* QUIZ FORM */
  .quiz-q { margin-bottom: 20px; }
  .quiz-q-text { font-size: 0.88rem; color: #94a3b8; margin-bottom: 10px; line-height: 1.5; }
  .quiz-options { display: flex; flex-direction: column; gap: 8px; }
  .quiz-option {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 11px 14px; cursor: pointer;
    transition: all 0.2s; font-size: 0.85rem; color: #94a3b8;
  }
  .quiz-option:hover { border-color: rgba(0,212,170,0.25); color: #e2e8f0; }
  .quiz-option.selected { border-color: #00d4aa; background: rgba(0,212,170,0.08); color: #e2e8f0; }
  .quiz-radio {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s;
  }
  .quiz-option.selected .quiz-radio { border-color: #00d4aa; }
  .quiz-radio-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #00d4aa;
    transform: scale(0); transition: transform 0.2s;
  }
  .quiz-option.selected .quiz-radio-dot { transform: scale(1); }

  .progress-bar-wrap { margin-bottom: 20px; }
  .progress-bar-label { display: flex; justify-content: space-between; font-size: 0.75rem; color: #475569; margin-bottom: 8px; }
  .progress-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 100px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #00d4aa, #6366f1); border-radius: 100px; transition: width 0.4s; }

  /* PERFORMANCE HISTORY */
  .history-list { display: flex; flex-direction: column; gap: 10px; }
  .history-item {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 16px;
  }
  .history-left { display: flex; align-items: center; gap: 12px; }
  .history-icon { font-size: 18px; }
  .history-date { font-size: 0.78rem; color: #475569; margin-top: 3px; }
  .history-name { font-size: 0.88rem; color: #94a3b8; font-weight: 500; }
  .tag {
    padding: 4px 12px; border-radius: 100px; font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .tag-strong { background: rgba(0,212,170,0.12); color: #00d4aa; border: 1px solid rgba(0,212,170,0.25); }
  .tag-average { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
  .tag-weak { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
`;

const navItems = [
  { icon: "📊", label: "Dashboard", active: true },
  { icon: "🔮", label: "Predict" },
  { icon: "📝", label: "Quizzes" },
  { icon: "📈", label: "Progress" },
  { icon: "💡", label: "Suggestions" },
  { icon: "⚙️", label: "Settings" },
];

const statCards = [
  { icon: "📚", label: "Study Hours", val: "4.2", unit: "/day", trend: "+0.8", up: true },
  { icon: "📝", label: "Quiz Score", val: "76%", unit: "", trend: "+4%", up: true },
  { icon: "✅", label: "Attendance", val: "89%", unit: "", trend: "-2%", up: false },
  { icon: "📋", label: "Assignments", val: "92%", unit: "", trend: "+6%", up: true },
];

const history = [
  { icon: "🔮", name: "Performance Prediction", date: "Today, 10:14 AM", tag: "Strong", cls: "tag-strong" },
  { icon: "📝", name: "Mid-Term Quiz", date: "Yesterday, 2:30 PM", tag: "Average", cls: "tag-average" },
  { icon: "🔮", name: "Performance Prediction", date: "Mar 18, 9:00 AM", tag: "Average", cls: "tag-average" },
  { icon: "📝", name: "Chapter 4 Quiz", date: "Mar 15, 11:20 AM", tag: "Strong", cls: "tag-strong" },
];

const quizQuestions = [
  {
    q: "Which data structure uses LIFO (Last In, First Out) order?",
    opts: ["Queue", "Stack", "Linked List", "Binary Tree"]
  },
  {
    q: "What is the time complexity of binary search?",
    opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"]
  }
];

export default function StudentDashboard({ onPredict, onQuizSubmit, loading }) {
  const [form, setForm] = useState({
    studyTime: 4, quizScore: "", attendance: "", assignments: "", lessons: "", attempts: 3
  });
  const [answers, setAnswers] = useState({});
  const [activeNav, setActiveNav] = useState(0);

  const handlePredict = () => { if (onPredict) onPredict(form); };
  const handleQuiz = () => { if (onQuizSubmit) onQuizSubmit(answers); };

  return (
    <>
      <style>{styles}</style>
      <div className="sd-root">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🧠</div>
            EduPredict
          </div>
          <div className="sidebar-nav">
            <div className="sidebar-section">Main Menu</div>
            {navItems.map((n, i) => (
              <button key={n.label} className={`nav-item ${activeNav === i ? "active" : ""}`}
                onClick={() => setActiveNav(i)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">👦</div>
            <div>
              <div className="user-name">Alex Johnson</div>
              <div className="user-role">Student · Grade 11</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="sd-main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-title">
              <h2>Student Dashboard</h2>
              <p>Tuesday, March 31, 2025</p>
            </div>
            <div className="topbar-actions">
              <div className="badge-notif">🔔</div>
              <button className="btn-predict" onClick={handlePredict}>
                ⚡ Predict Now
              </button>
            </div>
          </div>

          <div className="sd-body">
            {/* STAT CARDS */}
            <div className="stat-cards">
              {statCards.map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-card-top">
                    <span className="stat-card-icon">{s.icon}</span>
                    <span className={`stat-card-trend ${s.up ? "trend-up" : "trend-down"}`}>
                      {s.trend}
                    </span>
                  </div>
                  <div className="stat-card-val">{s.val}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CONTENT GRID */}
            <div className="content-grid">
              {/* PREDICT FORM */}
              <div className="panel">
                <div className="panel-header">
                  <h3>⚡ Predict Performance</h3>
                  <span>Enter your data</span>
                </div>
                <div className="panel-body">
                  <div className="form-grid">
                    <div className="field">
                      <label>Quiz Score (%)</label>
                      <input type="number" min="0" max="100" placeholder="0–100"
                        value={form.quizScore}
                        onChange={e => setForm({...form, quizScore: e.target.value})} />
                    </div>
                    <div className="field">
                      <label>Attendance (%)</label>
                      <input type="number" min="0" max="100" placeholder="0–100"
                        value={form.attendance}
                        onChange={e => setForm({...form, attendance: e.target.value})} />
                    </div>
                    <div className="field">
                      <label>Assignments (%)</label>
                      <input type="number" min="0" max="100" placeholder="0–100"
                        value={form.assignments}
                        onChange={e => setForm({...form, assignments: e.target.value})} />
                    </div>
                    <div className="field">
                      <label>Lessons Done (%)</label>
                      <input type="number" min="0" max="100" placeholder="0–100"
                        value={form.lessons}
                        onChange={e => setForm({...form, lessons: e.target.value})} />
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div className="field">
                      <label>Daily Study Time — <span style={{color:"#00d4aa"}}>{form.studyTime} hrs</span></label>
                      <div className="slider-row">
                        <input type="range" min="0" max="12" step="0.5"
                          value={form.studyTime}
                          onChange={e => setForm({...form, studyTime: parseFloat(e.target.value)})} />
                        <span className="slider-val">{form.studyTime}h</span>
                      </div>
                    </div>
                    <div className="field" style={{marginTop:12}}>
                      <label>Quiz Attempts — <span style={{color:"#00d4aa"}}>{form.attempts}×</span></label>
                      <div className="slider-row">
                        <input type="range" min="0" max="10" step="1"
                          value={form.attempts}
                          onChange={e => setForm({...form, attempts: parseInt(e.target.value)})} />
                        <span className="slider-val">{form.attempts}×</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn-full" onClick={handlePredict} disabled={loading}>
                    {loading ? "Predicting…" : "🔮 Predict My Performance"}
                  </button>
                </div>
              </div>

              {/* QUIZ FORM */}
              <div className="panel">
                <div className="panel-header">
                  <h3>📝 Today's Quiz</h3>
                  <span>2 questions</span>
                </div>
                <div className="panel-body">
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-label">
                      <span>Progress</span>
                      <span>{Object.keys(answers).length}/{quizQuestions.length} answered</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill"
                        style={{ width: `${(Object.keys(answers).length / quizQuestions.length) * 100}%` }} />
                    </div>
                  </div>

                  {quizQuestions.map((qq, qi) => (
                    <div className="quiz-q" key={qi}>
                      <div className="quiz-q-text"><strong style={{color:"#94a3b8"}}>Q{qi+1}.</strong> {qq.q}</div>
                      <div className="quiz-options">
                        {qq.opts.map((opt, oi) => (
                          <div key={oi}
                            className={`quiz-option ${answers[qi] === oi ? "selected" : ""}`}
                            onClick={() => setAnswers({...answers, [qi]: oi})}>
                            <div className="quiz-radio">
                              <div className="quiz-radio-dot" />
                            </div>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button className="btn-full"
                    style={Object.keys(answers).length < quizQuestions.length ? {opacity:0.5}:{}}
                    onClick={handleQuiz}
                    disabled={Object.keys(answers).length < quizQuestions.length}>
                    Submit Quiz →
                  </button>
                </div>
              </div>

              {/* HISTORY */}
              <div className="panel" style={{ gridColumn: "1 / -1" }}>
                <div className="panel-header">
                  <h3>📜 Recent Activity</h3>
                  <span>Last 7 days</span>
                </div>
                <div className="panel-body">
                  <div className="history-list">
                    {history.map((h, i) => (
                      <div className="history-item" key={i}>
                        <div className="history-left">
                          <span className="history-icon">{h.icon}</span>
                          <div>
                            <div className="history-name">{h.name}</div>
                            <div className="history-date">{h.date}</div>
                          </div>
                        </div>
                        <span className={`tag ${h.cls}`}>{h.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}