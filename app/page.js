export default function Home() {
  return (
    <main className="landing-page">
      <div className="pattern pattern-one"></div>
      <div className="pattern pattern-two"></div>

      <section className="landing-content">
        <div className="brand-mark" aria-label="Helix Academy logo">
          <span className="brand-symbol">H</span>
          <span className="brand-dot"></span>
        </div>

        <p className="brand-kicker">HELIX ACADEMY</p>

        <h1>
          Helix
          <span> Academy</span>
        </h1>

        <p className="brand-subtitle">
          Helix Online Tutorial <strong>[H•O•T]</strong>
        </p>

        <div className="divider"></div>

        <p className="intro-text">
          Prepare with purpose. Practice with confidence. Build the knowledge
          that moves you forward.
        </p>

        <button className="primary-button">
          Enter Simulator
          <span className="button-arrow">→</span>
        </button>

        <p className="access-note">
          A focused practice environment for UTME candidates
        </p>
      </section>

      <footer className="landing-footer">
        <span className="footer-line"></span>
        <p>Driven By Knowledge; Built for Success</p>
        <span className="footer-line"></span>
      </footer>
    </main>
  );
}
