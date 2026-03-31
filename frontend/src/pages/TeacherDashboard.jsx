import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .td-root {
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
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
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
  .sidebar-role-badge {
    margin: 12px 16px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px; padding: 8px 12px;
    font-size: 0.72rem; color: #a5b4fc;
    letter-spacing: 0.06em; text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
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
  .nav-item.active { background: rgba(99,102,241,0.12); color: #a5b4fc; font-weight: 500; }
  .nav-count {
    margin-left: auto; font-size: 0.7rem; padding: 1px 7px; border-radius: 100px;
    background: rgba(239,68,68,0.15); color: #ef4444;
  }
  .sidebar-user {
    padding: 16px; margin: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .user-name { font-size: 0.85rem; font-weight: 500; color: #e2e8f0; }
  .user-role { font-size: 0.72rem; color: #475569; }

  /* ── MAIN ── */
  .td-main { flex: 1; overflow-y: auto; min-width: 0; }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(6,12,26,0.6); backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 10;
    gap: 12px; flex-wrap: wrap;
  }
  .topbar-title h2 {
    font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800;
    color: #fff; letter-spacing: -0.03em;
  }
  .topbar-title p { font-size: 0.82rem; color: #475569; margin-top: 2px; }
  .topbar-right { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

  .search-input-wrap { position: relative; }
  .search-input-wrap input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 9px 14px 9px 36px;
    color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    outline: none; transition: border-color 0.2s; width: 200px;
  }
  .search-input-wrap input:focus { border-color: rgba(99,102,241,0.5); }
  .search-input-wrap input::placeholder { color: #334155; }
  .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 14px; }

  .btn-export {
    padding: 9px 18px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700;
    color: #a5b4fc; cursor: pointer;
    transition: background 0.2s;
  }
  .btn-export:hover { background: rgba(99,102,241,0.2); }

  .td-body { padding: 28px 32px; }

  /* STAT CARDS */
  .stat-cards {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 14px; margin-bottom: 24px;
  }
  @media(max-width:900px){ .stat-cards{ grid-template-columns:1fr 1fr; } }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 20px 18px;
    transition: border-color 0.3s;
  }
  .stat-card:hover { border-color: rgba(99,102,241,0.25); }
  .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .stat-icon-box {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .stat-val {
    font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
    color: #fff; letter-spacing: -0.04em;
  }
  .stat-label { font-size: 0.78rem; color: #64748b; }
  .stat-sub { font-size: 0.72rem; margin-top: 6px; }

  /* FILTER TABS */
  .filter-tabs { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .filter-tab {
    padding: 7px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 500;
    border: 1px solid rgba(255,255,255,0.1); background: transparent;
    color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .filter-tab:hover { border-color: rgba(99,102,241,0.3); color: #94a3b8; }
  .filter-tab.active {
    background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.35); color: #a5b4fc;
  }
  .filter-tab.weak-tab.active {
    background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444;
  }

  /* STUDENT TABLE */
  .table-panel {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; overflow: hidden; margin-bottom: 24px;
  }
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .table-header h3 {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em;
  }
  .table-header span { font-size: 0.78rem; color: #475569; }

  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  th {
    text-align: left; padding: 12px 24px;
    font-size: 0.7rem; color: #475569;
    letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;
  }
  tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s; cursor: pointer;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.025); }
  td { padding: 14px 24px; font-size: 0.88rem; color: #94a3b8; vertical-align: middle; }

  .student-cell { display: flex; align-items: center; gap: 12px; }
  .student-av {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .student-name { font-weight: 500; color: #e2e8f0; font-size: 0.9rem; }
  .student-id { font-size: 0.72rem; color: #475569; }

  .tag {
    display: inline-block; padding: 4px 12px; border-radius: 100px;
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .tag-strong { background: rgba(0,212,170,0.12); color: #00d4aa; border: 1px solid rgba(0,212,170,0.2); }
  .tag-average { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
  .tag-weak { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

  .score-cell { display: flex; align-items: center; gap: 8px; }
  .score-bar { width: 60px; height: 4px; border-radius: 100px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 100px; }

  .action-btn {
    padding: 5px 12px; border-radius: 8px;
    font-size: 0.72rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid rgba(255,255,255,0.1); background: transparent;
    color: #64748b; transition: all 0.2s;
  }
  .action-btn:hover { border-color: rgba(99,102,241,0.35); color: #a5b4fc; }

  /* BOTTOM GRID */
  .bottom-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media(max-width:800px){ .bottom-grid{ grid-template-columns:1fr; } }

  .panel {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; overflow: hidden;
  }
  .panel-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-header h3 {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: #fff; letter-spacing: -0.02em;
  }
  .panel-header span { font-size: 0.78rem; color: #475569; }
  .panel-body { padding: 20px 24px; }

  /* DISTRIBUTION BARS */
  .dist-item { margin-bottom: 16px; }
  .dist-label-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .dist-label { font-size: 0.82rem; color: #94a3b8; }
  .dist-count { font-family: 'Syne', sans-serif; font-size: 0.88rem; font-weight: 700; color: #fff; }
  .dist-bar { height: 8px; border-radius: 100px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .dist-bar-fill { height: 100%; border-radius: 100px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }

  /* ALERTS */
  .alert-list { display: flex; flex-direction: column; gap: 10px; }
  .alert-item {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 12px; padding: 14px 16px;
  }
  .alert-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .alert-name { font-size: 0.88rem; color: #fca5a5; font-weight: 500; margin-bottom: 4px; }
  .alert-detail { font-size: 0.78rem; color: #7f1d1d; line-height: 1.4; }
  .alert-action {
    margin-left: auto; flex-shrink: 0;
    padding: 5px 12px; border-radius: 8px;
    font-size: 0.72rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1);
    color: #ef4444; transition: all 0.2s; white-space: nowrap;
  }
  .alert-action:hover { background: rgba(239,68,68,0.2); }
`;

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

export default function TeacherDashboard() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState(0);

  const filtered = students.filter(s =>
    (filter === "All" || s.tag === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
  );

  return (
    <>
      <style>{styles}</style>
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
              <div className="user-name">Dr. Sarah Chen</div>
              <div className="user-role">Teacher · CS Dept.</div>
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
              <button className="btn-export">⬇ Export Report</button>
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
                          <button className="action-btn">View →</button>
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
                  <span>42 students</span>
                </div>
                <div className="panel-body">
                  {[
                    { label: "Strong Students", count: 18, pct: 43, color: "#00d4aa" },
                    { label: "Average Students", count: 16, pct: 38, color: "#f59e0b" },
                    { label: "Weak Students", count: 8, pct: 19, color: "#ef4444" },
                  ].map(d => (
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
                        <button className="alert-action">Contact</button>
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