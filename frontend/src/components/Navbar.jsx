const Navbar = ({ currentPage, setCurrentPage }) => {
  const links = [
    { key: 'home', label: 'Home' },
    { key: 'student', label: 'Student Dashboard' },
    { key: 'teacher', label: 'Teacher Dashboard' },
    { key: 'result', label: 'Result Page' },
  ];

  return (
    <nav className="navbar card">
      <h2>Smart Student System</h2>
      <div className="nav-links">
        {links.map((link) => (
          <button
            key={link.key}
            className={currentPage == link.key ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentPage(link.key)}
            type="button"
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
