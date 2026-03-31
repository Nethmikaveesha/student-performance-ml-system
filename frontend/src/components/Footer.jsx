const Footer = () => {
  return (
    <footer className="footer card">
      <section className="footer-section footer-brand">
        <h3>EduPredict</h3>
        <p>
          Smart Student Performance Prediction System powered by EduPredict.
          We help educators and learners identify risk early and improve outcomes faster.
        </p>
      </section>

      <section className="footer-section">
        <h4>Contact</h4>
        <p>Email: support@edupredict.com</p>
        <p>Phone: +94 77 123 4567</p>
        <p>Location: Colombo, Sri Lanka</p>
      </section>

      <section className="footer-section">
        <h4>Platform</h4>
        <p>Real-time prediction and analytics</p>
        <p>Student and teacher dashboards</p>
        <p>Secure academic data storage</p>
      </section>

      <section className="footer-section">
        <h4>Legal</h4>
        <p>Privacy Policy</p>
        <p>Terms and Conditions</p>
        <small>© 2026 EduPredict. All rights reserved.</small>
      </section>
    </footer>
  );
};

export default Footer;