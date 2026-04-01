import { useMemo, useState } from "react";
import '../styles/StudentDashboard.css';

const navItems = [
  { icon: "📊", label: "Dashboard", section: "dashboard", page: "student-dashboard" },
  { icon: "🔮", label: "Predict", section: "predict", page: "student-predict" },
  { icon: "📝", label: "Quizzes", section: "quizzes", page: "student-quizzes" },
  { icon: "📈", label: "Progress", section: "progress", page: "student-progress" },
  { icon: "💡", label: "Suggestions", section: "suggestions", page: "student-suggestions" },
  { icon: "⚙️", label: "Settings", section: "settings", page: "student-settings" },
];

const fallbackHistory = [];

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

export default function StudentDashboard({
  onPredict,
  onQuizSubmit,
  loading,
  currentUser,
  predictionHistory = [],
  currentSection = "dashboard",
  onNavigate,
  onLogout,
  predictError = "",
  onClearPredictError,
  quizApiError = "",
  onClearQuizApiError,
}) {
  const [form, setForm] = useState({
    studyTime: 0, quizScore: "", attendance: "", assignments: "", lessons: "", attempts: 1
  });
  const [answers, setAnswers] = useState({});
  const [quizMessage, setQuizMessage] = useState("");
  const [quizActivities, setQuizActivities] = useState([]);

  const studentId =
    currentUser?.studentId ||
    currentUser?.email?.split("@")[0]?.toUpperCase() ||
    currentUser?.name?.replace(/\s+/g, "").toUpperCase() ||
    "STUDENT_DEMO";

  const liveHistory = useMemo(() => {
    const predictionActivities = predictionHistory.map((item) => ({
      icon: "🔮",
      name: "Performance Prediction",
      date: new Date(item.createdAt).toLocaleString(),
      tag: item.prediction,
      timestamp: new Date(item.createdAt).getTime(),
      cls:
        item.prediction === "Strong"
          ? "tag-strong"
          : item.prediction === "Average"
          ? "tag-average"
          : "tag-weak",
    }));

    return [...predictionActivities, ...quizActivities]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);
  }, [predictionHistory, quizActivities]);

  const latest = predictionHistory[0];
  const previous = predictionHistory[1];

  const metricDelta = (currentValue, previousValue) => {
    if (currentValue === undefined || currentValue === null) return { text: "0", up: true };
    if (previousValue === undefined || previousValue === null) return { text: "new", up: true };
    const diff = Number(currentValue) - Number(previousValue);
    return { text: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`, up: diff >= 0 };
  };

  const studyDelta = metricDelta(latest?.studyTime, previous?.studyTime);
  const quizDelta = metricDelta(latest?.quizScore, previous?.quizScore);
  const attendanceDelta = metricDelta(latest?.attendancePercentage, previous?.attendancePercentage);
  const assignmentDelta = metricDelta(latest?.assignmentCompletion, previous?.assignmentCompletion);
  const formatHours = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "0";
    return Number.isInteger(num) ? String(num) : num.toFixed(1);
  };

  const statCards = [
    {
      icon: "📚",
      label: "Study Hours",
      val: latest?.studyTime !== undefined ? formatHours(latest.studyTime) : formatHours(form.studyTime),
      trend: studyDelta.text,
      up: studyDelta.up,
    },
    {
      icon: "📝",
      label: "Quiz Score",
      val: latest?.quizScore !== undefined ? `${latest.quizScore}%` : form.quizScore ? `${form.quizScore}%` : "0%",
      trend: quizDelta.text,
      up: quizDelta.up,
    },
    {
      icon: "✅",
      label: "Attendance",
      val:
        latest?.attendancePercentage !== undefined
          ? `${latest.attendancePercentage}%`
          : form.attendance
          ? `${form.attendance}%`
          : "0%",
      trend: attendanceDelta.text,
      up: attendanceDelta.up,
    },
    {
      icon: "📋",
      label: "Assignments",
      val:
        latest?.assignmentCompletion !== undefined
          ? `${latest.assignmentCompletion}/10`
          : form.assignments
          ? `${form.assignments}%`
          : "0%",
      trend: assignmentDelta.text,
      up: assignmentDelta.up,
    },
  ];

  const handlePredict = async () => {
    if (!onPredict) return;
    onClearPredictError?.();
    const payload = {
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
    onClearQuizApiError?.();
    const correct = quizAnswers.reduce((acc, correctIndex, idx) => (answers[idx] === correctIndex ? acc + 1 : acc), 0);
    const score = Math.round((correct / quizQuestions.length) * 100);
    try {
      await onQuizSubmit({ quizScore: score });
    } catch {
      return;
    }
    setQuizMessage(`Quiz submitted. Score: ${score}%`);
    setQuizActivities((prev) => [
      {
        icon: "📝",
        name: "Quiz Submission",
        date: new Date().toLocaleString(),
        tag: score >= 75 ? "Strong" : score >= 50 ? "Average" : "Weak",
        cls: score >= 75 ? "tag-strong" : score >= 50 ? "tag-average" : "tag-weak",
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    setAnswers({});
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
            {navItems.map((n) => (
              <button
                key={n.label}
                className={`nav-item ${currentSection === n.section ? "active" : ""}`}
                onClick={() => onNavigate?.(n.page)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">👦</div>
            <div>
              <div className="user-name">{currentUser?.name || "Alex Johnson"}</div>
                <div className="user-role">{(currentUser?.role || "student").toUpperCase()} · {studentId}</div>
            </div>
          </div>
          <div style={{ padding: "0 8px 12px" }}>
            <button className="nav-item" onClick={onLogout}>
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="sd-main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-title">
              <h2>Student Dashboard</h2>
              <p>{new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
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
            {(currentSection === "dashboard" || currentSection === "analytics") && (
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
            )}

            {/* CONTENT GRID */}
            <div className="content-grid">
              {/* PREDICT FORM */}
              {currentSection === "predict" && (
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
                      <input type="number" min="40" max="100" placeholder="40–100"
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
                        <input type="range" min="0" max="6" step="0.5"
                          value={form.studyTime}
                          onChange={e => setForm({...form, studyTime: parseFloat(e.target.value)})} />
                        <span className="slider-val">{form.studyTime}h</span>
                      </div>
                    </div>
                    <div className="field" style={{marginTop:12}}>
                      <label>Quiz Attempts — <span style={{color:"#00d4aa"}}>{form.attempts}×</span></label>
                      <div className="slider-row">
                        <input type="range" min="1" max="5" step="1"
                          value={form.attempts}
                          onChange={e => setForm({...form, attempts: parseInt(e.target.value)})} />
                        <span className="slider-val">{form.attempts}×</span>
                      </div>
                    </div>
                  </div>

                  {predictError && (
                    <p className="sd-api-error" style={{ color: "#f87171", fontSize: "0.85rem", marginTop: 10 }}>
                      {predictError}
                    </p>
                  )}
                  <button className="btn-full" onClick={handlePredict} disabled={loading}>
                    {loading ? "Predicting…" : "🔮 Predict My Performance"}
                  </button>
                </div>
              </div>
              )}

              {/* QUIZ FORM */}
              {currentSection === "quizzes" && (
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
                  {quizApiError && (
                    <p style={{ marginTop: 10, color: "#f87171", fontSize: "0.85rem" }}>{quizApiError}</p>
                  )}
                  {quizMessage && (
                    <p style={{ marginTop: 10, color: "#00d4aa", fontSize: "0.85rem" }}>{quizMessage}</p>
                  )}
                </div>
              </div>
              )}

              {currentSection === "suggestions" && (
                <div className="panel" style={{ gridColumn: "1 / -1" }}>
                  <div className="panel-header">
                    <h3>💡 Personalized Suggestions</h3>
                    <span>Based on your recent activity</span>
                  </div>
                  <div className="panel-body">
                    <ul className="suggestions-list">
                      <li>Increase daily study time by at least 30 minutes on weak subjects.</li>
                      <li>Attempt at least one practice quiz every day this week.</li>
                      <li>Keep attendance above 85% for stronger predictions.</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentSection === "settings" && (
                <div className="panel" style={{ gridColumn: "1 / -1" }}>
                  <div className="panel-header">
                    <h3>⚙️ Dashboard Settings</h3>
                    <span>Profile preferences</span>
                  </div>
                  <div className="panel-body">
                    <p style={{ color: "#94a3b8" }}>Notification preferences and profile settings can be configured here.</p>
                  </div>
                </div>
              )}

              {/* HISTORY */}
              {currentSection === "progress" && (
              <div className="panel" style={{ gridColumn: "1 / -1" }}>
                <div className="panel-header">
                  <h3>📜 Recent Activity</h3>
                  <span>Last 7 days</span>
                </div>
                <div className="panel-body">
                  <div className="history-list">
                    {(liveHistory.length ? liveHistory : fallbackHistory).map((h, i) => (
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
                    {!liveHistory.length && (
                      <p style={{ color: "#64748b", margin: 0 }}>No activity yet. Submit a prediction or quiz to see recent activity.</p>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}