"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showAccessPanel, setShowAccessPanel] = useState(false);

  function closeAccessPanel() {
    setShowAccessPanel(false);
  }

  return (
    <main className="landing-page">
      <div className="background-grid"></div>

      <div className="background-circle background-circle-one"></div>

      <div className="background-circle background-circle-two"></div>

      <section className="landing-content">
        <div className="brand-mark">
          <span className="brand-letter">H</span>
          <span className="brand-dot"></span>
        </div>

        <p className="brand-kicker">HELIX ACADEMY</p>

        <h1>
          Helix <span>Academy</span>
        </h1>

        <p className="brand-subtitle">
          Helix Online Tutorial <strong>[H•O•T]</strong>
        </p>

        <div className="divider"></div>

        <p className="intro-text">
          Prepare with purpose. Practice with confidence. Build the knowledge
          that moves you forward.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={() => setShowAccessPanel(true)}
        >
          Enter Simulator
          <span className="button-arrow">→</span>
        </button>

        <p className="access-note">
          A focused practice environment for UTME candidates
        </p>
      </section>

      <footer className="landing-footer">
        <span className="footer-line"></span>
        <span>Driven By Knowledge; Built for Success</span>
        <span className="footer-line"></span>
      </footer>

      {showAccessPanel && (
        <div className="modal-overlay" onClick={closeAccessPanel}>
          <section
            className="access-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-title"
          >
            <button
              className="close-button"
              type="button"
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
              <Link href="/admin" className="portal-card">
                <span className="portal-icon">A</span>

                <span className="portal-text">
                  <strong>Admin Portal</strong>
                  <small>Create and manage mock tests</small>
                </span>

                <span className="portal-arrow">→</span>
              </Link>

              <Link href="/student" className="portal-card">
                <span className="portal-icon">S</span>

                <span className="portal-text">
                  <strong>Student Portal</strong>
                  <small>Enter your details and access a simulation</small>
                </span>

                <span className="portal-arrow">→</span>
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  );
              }
