import { useMemo, useState } from "react";
import '../styles/TeacherDashboard.css';

const navItems = [
  { icon: "📊", label: "Overview", section: "overview", page: "teacher-overview" },
  { icon: "👥", label: "All Students", section: "allstudents", page: "teacher-allstudents" },
  { icon: "⚠️", label: "At Risk", section: "atrisk", page: "teacher-atrisk", count: 3 },
  { icon: "📈", label: "Analytics", section: "analytics", page: "teacher-analytics" },
  { icon: "📋", label: "Reports", section: "reports", page: "teacher-reports" },
  { icon: "⚙️", label: "Settings", section: "settings", page: "teacher-settings" },
];

const scoreColor = (s) => s >= 75 ? "#00d4aa" : s >= 50 ? "#f59e0b" : "#ef4444";

export default function TeacherDashboard({ history = [], students = [], currentUser, currentSection = "overview", onNavigate, onLogout }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const dynamicStudents = useMemo(() => {
    const latestByStudent = new Map();
    history.forEach((item) => {
      const key = item.studentId || "UNKNOWN";
      const prev = latestByStudent.get(key);
      if (!prev || new Date(item.createdAt).getTime() > new Date(prev.createdAt).getTime()) {
        latestByStudent.set(key, item);
      }
    });

    const studentMap = new Map(students.map((s) => [s.studentId, s]));
    const rows = Array.from(latestByStudent.values()).map((h, idx) => {
      const studentRecord = studentMap.get(h.studentId);
      const prediction = h.prediction || "Average";
      return {
        name: studentRecord?.name || h.studentId || `Student ${idx + 1}`,
        id: h.studentId || `STU-${String(idx + 1).padStart(3, "0")}`,
        emoji: "🧑",
        tag: prediction,
        cls: prediction === "Strong" ? "tag-strong" : prediction === "Weak" ? "tag-weak" : "tag-average",
        quiz: Number(h.quizScore || 0),
        attendance: Number(h.attendancePercentage || 0),
        study: Number(h.studyTime || 0),
        assignment: Number(h.assignmentCompletion || 0),
      };
    });

    if (rows.length) return rows;
    return students.map((s, idx) => ({
      name: s.name,
      id: s.studentId || `STU-${String(idx + 1).padStart(3, "0")}`,
      emoji: "🧑",
      tag: "Average",
      cls: "tag-average",
      quiz: 0,
      attendance: 0,
      study: 0,
      assignment: 0,
    }));
  }, [history, students]);

  const effectiveFilter = currentSection === "atrisk" ? "Weak" : filter;

  const filtered = dynamicStudents.filter(s =>
    (effectiveFilter === "All" || s.tag === effectiveFilter) &&
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

  const avgQuiz = dynamicStudents.length ? Math.round(dynamicStudents.reduce((a, c) => a + Number(c.quiz || 0), 0) / dynamicStudents.length) : 0;
  const avgAttendance = dynamicStudents.length
    ? Math.round(dynamicStudents.reduce((a, c) => a + Number(c.attendance || 0), 0) / dynamicStudents.length)
    : 0;
  const avgAssignments = dynamicStudents.length
    ? Math.round((dynamicStudents.reduce((a, c) => a + Number(c.assignment || 0), 0) / (dynamicStudents.length * 10)) * 100)
    : 0;

  const statCards = [
    {
      icon: "👥",
      bg: "rgba(99,102,241,0.12)",
      label: "Total Students",
      val: String(dynamicStudents.length),
      sub: `${students.length} registered`,
      subColor: "#00d4aa",
    },
    {
      icon: "🏆",
      bg: "rgba(0,212,170,0.12)",
      label: "Strong Performers",
      val: String(distribution[0].count),
      sub: `${distribution[0].pct}% of class`,
      subColor: "#00d4aa",
    },
    {
      icon: "📊",
      bg: "rgba(245,158,11,0.1)",
      label: "Average Students",
      val: String(distribution[1].count),
      sub: `${distribution[1].pct}% of class`,
      subColor: "#f59e0b",
    },
    {
      icon: "⚠️",
      bg: "rgba(239,68,68,0.1)",
      label: "At-Risk Students",
      val: String(distribution[2].count),
      sub: distribution[2].count ? "Needs attention" : "Stable",
      subColor: "#ef4444",
    },
  ];

  const alerts = dynamicStudents
    .filter((s) => s.tag === "Weak" || s.attendance < 60 || s.quiz < 50)
    .slice(0, 4)
    .map((s) => ({
      name: s.name,
      detail: `Quiz: ${s.quiz}%, Attendance: ${s.attendance}%, Study time: ${s.study}h/day`,
    }));

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
            {navItems.map((n) => (
              <button
                key={n.label}
                className={`nav-item ${currentSection === n.section ? "active" : ""}`}
                onClick={() => onNavigate?.(n.page)}
              >
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
          <div style={{ padding: "0 8px 12px" }}>
            <button className="nav-item" onClick={onLogout}>
              <span>🚪</span>
              Logout
            </button>
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
            {(currentSection === "overview" || currentSection === "analytics") && (
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
            )}

            {/* FILTER TABS */}
            {(currentSection === "overview" || currentSection === "allstudents" || currentSection === "atrisk" || currentSection === "reports") && (
            <div className="filter-tabs">
              {["All","Strong","Average","Weak"].map(f => (
                <button key={f}
                  className={`filter-tab ${f === "Weak" && filter === "Weak" ? "weak-tab " : ""}${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}>
                  {f === "All" ? "All Students" : f === "Weak" ? "⚠️ At Risk" : f}
                </button>
              ))}
            </div>
            )}

            {/* STUDENT TABLE */}
            {(currentSection === "allstudents" || currentSection === "atrisk") && (
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
            )}

            {currentSection === "reports" && (
              <div className="panel">
                <div className="panel-header">
                  <h3>📋 Reports Center</h3>
                  <span>{dynamicStudents.length} students in current dataset</span>
                </div>
                <div className="panel-body">
                  <div className="stat-cards" style={{ marginBottom: 16 }}>
                    <div className="stat-card">
                      <div className="stat-val">{dynamicStudents.length}</div>
                      <div className="stat-label">Total Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val">{distribution[0].count}</div>
                      <div className="stat-label">Strong Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val">{distribution[1].count}</div>
                      <div className="stat-label">Average Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val">{distribution[2].count}</div>
                      <div className="stat-label">At-Risk Students</div>
                    </div>
                  </div>
                  <p style={{ color: "#94a3b8", marginBottom: 12 }}>
                    Use the export button in the top-right to download the current report as CSV.
                  </p>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Prediction</th>
                          <th>Quiz</th>
                          <th>Attendance</th>
                          <th>Study Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicStudents.slice(0, 10).map((s) => (
                          <tr key={`report-${s.id}`}>
                            <td>{s.name}</td>
                            <td>{s.tag}</td>
                            <td>{s.quiz}%</td>
                            <td>{s.attendance}%</td>
                            <td>{s.study}h/day</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM GRID */}
            {(currentSection === "analytics" || currentSection === "atrisk") && (
            <div className="bottom-grid">
              {/* DISTRIBUTION */}
              {currentSection === "analytics" && (
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
                      { label: "Quiz Score", val: avgQuiz, color: "#f59e0b" },
                      { label: "Attendance", val: avgAttendance, color: "#00d4aa" },
                      { label: "Assignments", val: avgAssignments, color: "#6366f1" },
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
              )}

              {/* ALERTS */}
              {currentSection === "atrisk" && (
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
                    {!alerts.length && (
                      <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No critical alerts at the moment.</div>
                    )}
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
              )}
            </div>
            )}

            {currentSection === "settings" && (
              <div className="panel">
                <div className="panel-header">
                  <h3>⚙️ Teacher Settings</h3>
                  <span>Manage preferences</span>
                </div>
                <div className="panel-body">
                  <p style={{ color: "#94a3b8" }}>Configure class preferences, alerts, and reporting defaults here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}