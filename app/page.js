"use client";

import { useState } from "react";

export default function Home() {
  const [showAccessPanel, setShowAccessPanel] = useState(false);

  function openAccessPanel() {
    setShowAccessPanel(true);
  }

  function closeAccessPanel() {
    setShowAccessPanel(false);
  }

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

        <button className="primary-button" onClick={openAccessPanel}>
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

      {showAccessPanel && (
        <div className="modal-overlay" onClick={closeAccessPanel}>
          <section
            className="access-modal"
            onClick={(event) => event.stopPropagation()}
            aria-modal="true"
            role="dialog"
            aria-labelledby="access-title"
          >
            <button
              className="close-button"
              onClick={closeAccessPanel}
              aria-label="Close access panel"
            >
              ×
            </button>

            <p className="modal-label">ACCESS PORTAL</p>

            <h2 id="access-title">How would you like to continue?</h2>

            <p className="modal-description">
              Select the portal that matches your role.
            </p>

            <div className="portal-options">
              <button className="portal-card" type="button">
                <span className="portal-icon">A</span>

                <span className="portal-text">
                  <strong>Admin Portal</strong>
                  <small>Create and manage mock tests</small>
                </span>

                <span className="portal-arrow">→</span>
              </button>

              <button className="portal-card" type="button">
                <span className="portal-icon">S</span>

                <span className="portal-text">
                  <strong>Student Portal</strong>
                  <small>Attempt an assigned mock test</small>
                </span>

                <span className="portal-arrow">→</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
