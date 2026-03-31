import { useMemo, useState } from "react";
import '../styles/TeacherDashboard.css';

const navItems = [
  { icon: "📊", label: "Overview", active: true },
  { icon: "👥", label: "All Students" },
  { icon: "⚠️", label: "At Risk", count: 3 },
  { icon: "📈", label: "Analytics" },
  { icon: "📋", label: "Reports" },
  { icon: "⚙️", label: "Settings" },
];

const statCards = [
  { icon: "👥", bg: "rgba(99,102,241,0.12)", label: "Total Students", val: "42", sub: "+3 this term", subColor: "#00d4aa" },
  { icon: "🏆", bg: "rgba(0,212,170,0.12)", label: "Strong Performers", val: "18", sub: "43% of class", subColor: "#00d4aa" },
  { icon: "📊", bg: "rgba(245,158,11,0.1)", label: "Average Students", val: "16", sub: "38% of class", subColor: "#f59e0b" },
  { icon: "⚠️", bg: "rgba(239,68,68,0.1)", label: "At-Risk Students", val: "8", sub: "Needs attention", subColor: "#ef4444" },
];

const students = [
  { name: "Aisha Patel", id: "STU-001", emoji: "👩", tag: "Strong", cls: "tag-strong", quiz: 91, attendance: 95, study: 6.5 },
  { name: "Marcus Bell", id: "STU-002", emoji: "👦", tag: "Average", cls: "tag-average", quiz: 65, attendance: 78, study: 3.5 },
  { name: "Lena Schmidt", id: "STU-003", emoji: "👧", tag: "Weak", cls: "tag-weak", quiz: 32, attendance: 48, study: 1.2 },
  { name: "Raj Kumar", id: "STU-004", emoji: "👨", tag: "Strong", cls: "tag-strong", quiz: 88, attendance: 92, study: 5.8 },
  { name: "Sofia Morales", id: "STU-005", emoji: "👩", tag: "Weak", cls: "tag-weak", quiz: 28, attendance: 52, study: 1.5 },
  { name: "James Okonkwo", id: "STU-006", emoji: "👦", tag: "Average", cls: "tag-average", quiz: 72, attendance: 81, study: 4.2 },
];

const alerts = [
  { name: "Lena Schmidt", detail: "Attendance dropped to 48% — missed 12 of last 25 classes. Quiz score: 32%." },
  { name: "Sofia Morales", detail: "No assignment submissions in 2 weeks. Study time under 2h/day." },
  { name: "Tyler Nguyen", detail: "Consecutive quiz failures. Predicted: Weak for the 2nd month running." },
];

const scoreColor = (s) => s >= 75 ? "#00d4aa" : s >= 50 ? "#f59e0b" : "#ef4444";

export default function TeacherDashboard({ history = [], currentUser }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState(0);

  const dynamicStudents = useMemo(() => {
    if (!history.length) return students;
    return history.map((h, idx) => ({
      name: h.studentId || `Student ${idx + 1}`,
      id: h.studentId || `STU-${String(idx + 1).padStart(3, "0")}`,
      emoji: "🧑",
      tag: h.prediction || "Average",
      cls:
        h.prediction === "Strong"
          ? "tag-strong"
          : h.prediction === "Weak"
          ? "tag-weak"
          : "tag-average",
      quiz: Number(h.quizScore || 0),
      attendance: Number(h.attendancePercentage || 0),
      study: Number(h.studyTime || 0),
    }));
  }, [history]);

  const filtered = dynamicStudents.filter(s =>
    (filter === "All" || s.tag === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
  );

  const distribution = useMemo(() => {
    const total = dynamicStudents.length || 1;
    const strong = dynamicStudents.filter((s) => s.tag === "Strong").length;
    const average = dynamicStudents.filter((s) => s.tag === "Average").length;
    const weak = dynamicStudents.filter((s) => s.tag === "Weak").length;
    return [
      { label: "Strong Students", count: strong, pct: Math.round((strong / total) * 100), color: "#00d4aa" },
      { label: "Average Students", count: average, pct: Math.round((average / total) * 100), color: "#f59e0b" },
      { label: "Weak Students", count: weak, pct: Math.round((weak / total) * 100), color: "#ef4444" },
    ];
  }, [dynamicStudents]);

  const exportCsv = () => {
    const headers = ["student_id", "prediction", "quiz_score", "attendance", "study_time"];
    const rows = filtered.map((s) => [s.id, s.tag, s.quiz, s.attendance, s.study]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teacher-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
<div className="td-root">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🧠</div>
            EduPredict
          </div>
          <div className="sidebar-role-badge">👩‍🏫 Teacher Portal</div>
          <div className="sidebar-nav">
            <div className="sidebar-section">Navigation</div>
            {navItems.map((n, i) => (
              <button key={n.label} className={`nav-item ${activeNav === i ? "active" : ""}`}
                onClick={() => setActiveNav(i)}>
                <span>{n.icon}</span>
                {n.label}
                {n.count && <span className="nav-count">{n.count}</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">👩</div>
            <div>
              <div className="user-name">{currentUser?.name || "Dr. Sarah Chen"}</div>
              <div className="user-role">Teacher · {currentUser?.email || "CS Dept."}</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="td-main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-title">
              <h2>Teacher Dashboard</h2>
              <p>Class Overview · Spring 2025</p>
            </div>
            <div className="topbar-right">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input placeholder="Search students…" value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn-export" onClick={exportCsv}>⬇ Export Report</button>
            </div>
          </div>

          <div className="td-body">
            {/* STAT CARDS */}
            <div className="stat-cards">
              {statCards.map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-top">
                    <div className="stat-icon-box" style={{ background: s.bg }}>{s.icon}</div>
                  </div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub" style={{ color: s.subColor }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* FILTER TABS */}
            <div className="filter-tabs">
              {["All","Strong","Average","Weak"].map(f => (
                <button key={f}
                  className={`filter-tab ${f === "Weak" && filter === "Weak" ? "weak-tab " : ""}${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}>
                  {f === "All" ? "All Students" : f === "Weak" ? "⚠️ At Risk" : f}
                </button>
              ))}
            </div>

            {/* STUDENT TABLE */}
            <div className="table-panel">
              <div className="table-header">
                <h3>👥 Student Performance</h3>
                <span>{filtered.length} students</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Quiz Score</th>
                      <th>Attendance</th>
                      <th>Study Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className="student-cell">
                            <div className="student-av"
                              style={{ background: s.tag === "Strong" ? "rgba(0,212,170,0.12)" : s.tag === "Average" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)" }}>
                              {s.emoji}
                            </div>
                            <div>
                              <div className="student-name">{s.name}</div>
                              <div className="student-id">{s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`tag ${s.cls}`}>{s.tag}</span></td>
                        <td>
                          <div className="score-cell">
                            <span style={{ color: scoreColor(s.quiz), fontWeight: 600 }}>{s.quiz}%</span>
                            <div className="score-bar">
                              <div className="score-bar-fill"
                                style={{ width: `${s.quiz}%`, background: scoreColor(s.quiz) }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="score-cell">
                            <span style={{ color: scoreColor(s.attendance) }}>{s.attendance}%</span>
                            <div className="score-bar">
                              <div className="score-bar-fill"
                                style={{ width: `${s.attendance}%`, background: scoreColor(s.attendance) }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "#94a3b8" }}>{s.study}h / day</td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() =>
                              alert(`${s.name}\nPrediction: ${s.tag}\nQuiz: ${s.quiz}%\nAttendance: ${s.attendance}%\nStudy: ${s.study}h/day`)
                            }
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOTTOM GRID */}
            <div className="bottom-grid">
              {/* DISTRIBUTION */}
              <div className="panel">
                <div className="panel-header">
                  <h3>📊 Class Distribution</h3>
                  <span>{dynamicStudents.length} students</span>
                </div>
                <div className="panel-body">
                  {distribution.map(d => (
                    <div className="dist-item" key={d.label}>
                      <div className="dist-label-row">
                        <span className="dist-label">{d.label}</span>
                        <span className="dist-count" style={{ color: d.color }}>{d.count} <span style={{color:"#475569",fontWeight:400,fontSize:"0.78rem"}}>({d.pct}%)</span></span>
                      </div>
                      <div className="dist-bar">
                        <div className="dist-bar-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "0.78rem", color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Class Average Metrics</div>
                    {[
                      { label: "Quiz Score", val: 68, color: "#f59e0b" },
                      { label: "Attendance", val: 75, color: "#00d4aa" },
                      { label: "Assignments", val: 72, color: "#6366f1" },
                    ].map(m => (
                      <div key={m.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontSize:"0.78rem", color:"#64748b", width:90, flexShrink:0 }}>{m.label}</span>
                        <div className="dist-bar" style={{ flex:1 }}>
                          <div className="dist-bar-fill" style={{ width:`${m.val}%`, background:m.color }} />
                        </div>
                        <span style={{ fontSize:"0.82rem", fontWeight:600, color:m.color, width:36, textAlign:"right", flexShrink:0 }}>{m.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ALERTS */}
              <div className="panel">
                <div className="panel-header">
                  <h3>⚠️ Attention Required</h3>
                  <span style={{ color:"#ef4444" }}>{alerts.length} alerts</span>
                </div>
                <div className="panel-body">
                  <div className="alert-list">
                    {alerts.map((a, i) => (
                      <div className="alert-item" key={i}>
                        <span className="alert-icon">🚨</span>
                        <div style={{ flex:1 }}>
                          <div className="alert-name">{a.name}</div>
                          <div className="alert-detail">{a.detail}</div>
                        </div>
                        <button
                          className="alert-action"
                          onClick={() => (window.location.href = "mailto:support@edupredict.com")}
                        >
                          Contact
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 16, padding: "12px 16px", borderRadius: 12,
                    background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
                    fontSize: "0.82rem", color: "#7c7cba", lineHeight: 1.5
                  }}>
                    💡 <strong style={{ color:"#a5b4fc" }}>Tip:</strong> Students flagged as Weak for 2+ consecutive predictions are likely to need intervention before the next exam cycle.
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