import { useMemo, useState } from "react";
import '../styles/StudentDashboard.css';

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

const fallbackHistory = [
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

const quizAnswers = [1, 2];

export default function StudentDashboard({ onPredict, onQuizSubmit, loading, currentUser, predictionHistory = [] }) {
  const [form, setForm] = useState({
    studyTime: 4, quizScore: "", attendance: "", assignments: "", lessons: "", attempts: 3
  });
  const [answers, setAnswers] = useState({});
  const [activeNav, setActiveNav] = useState(0);
  const [quizMessage, setQuizMessage] = useState("");

  const studentId =
    currentUser?.email?.split("@")[0]?.toUpperCase() ||
    currentUser?.name?.replace(/\s+/g, "").toUpperCase() ||
    "STUDENT_DEMO";

  const liveHistory = useMemo(() => {
    if (!predictionHistory.length) return fallbackHistory;
    return predictionHistory.slice(0, 6).map((item) => ({
      icon: "🔮",
      name: "Performance Prediction",
      date: new Date(item.createdAt).toLocaleString(),
      tag: item.prediction,
      cls:
        item.prediction === "Strong"
          ? "tag-strong"
          : item.prediction === "Average"
          ? "tag-average"
          : "tag-weak",
    }));
  }, [predictionHistory]);

  const handlePredict = async () => {
    if (!onPredict) return;
    const payload = {
      studentId,
      studyTime: Number(form.studyTime),
      attendancePercentage: Number(form.attendance),
      quizScore: Number(form.quizScore),
      assignmentCompletion: Number(form.assignments),
      numberOfAttempts: Number(form.attempts),
      lessonCompletionPercentage: Number(form.lessons),
    };
    await onPredict(payload);
  };

  const handleQuiz = async () => {
    if (!onQuizSubmit) return;
    const correct = quizAnswers.reduce((acc, correctIndex, idx) => (answers[idx] === correctIndex ? acc + 1 : acc), 0);
    const score = Math.round((correct / quizQuestions.length) * 100);
    await onQuizSubmit({ studentId, quizScore: score });
    setQuizMessage(`Quiz submitted. Score: ${score}%`);
  };

  return (
    <>
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
              <div className="user-name">{currentUser?.name || "Alex Johnson"}</div>
              <div className="user-role">Student · {studentId}</div>
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
                  {quizMessage && (
                    <p style={{ marginTop: 10, color: "#00d4aa", fontSize: "0.85rem" }}>{quizMessage}</p>
                  )}
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
                    {liveHistory.map((h, i) => (
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