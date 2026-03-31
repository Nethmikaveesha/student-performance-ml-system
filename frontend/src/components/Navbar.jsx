const Navbar = ({ currentPage, setCurrentPage }) => {
  const links = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'login', label: 'Login' },
    { key: 'signup', label: 'Signup' },
   
  ];

  return (
    <nav className="navbar card">
      <h2>EduPredict</h2>
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
