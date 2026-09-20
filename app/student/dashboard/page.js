"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboardPage() {
  const [candidate, setCandidate] = useState(null);
  const [activeType, setActiveType] = useState("mock");

  useEffect(() => {
    const savedCandidate = window.sessionStorage.getItem(
      "helix_candidate_session",
    );

    if (!savedCandidate) {
      window.location.href = "/student";
      return;
    }

    try {
      setCandidate(JSON.parse(savedCandidate));
    } catch {
      window.sessionStorage.removeItem("helix_candidate_session");
      window.location.href = "/student";
    }
  }, []);

  function handleExit() {
    window.sessionStorage.removeItem("helix_candidate_session");
    window.location.href = "/";
  }

  if (!candidate) {
    return (
      <main className="student-dashboard-page">
        <section className="student-loading-card">
          <p>Loading Candidate Dashboard...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="student-dashboard-page">
      <header className="student-dashboard-header">
        <div>
          <p className="dashboard-kicker">HELIX ACADEMY</p>

          <h1>Student Dashboard</h1>

          <p className="dashboard-subtitle">
            Welcome, {candidate.fullName}. Select a Mock or Test to continue.
          </p>
        </div>

        <button
          className="dashboard-home-link dashboard-exit-button"
          type="button"
          onClick={handleExit}
        >
          Exit
        </button>
      </header>

      <section className="student-dashboard-content">
        <div className="candidate-summary-card">
          <div>
            <p className="section-label section-label-light">
              REGISTERED CANDIDATE
            </p>

            <h2>{candidate.fullName}</h2>

            <p>
              Candidate ID: <strong>{candidate.candidateId}</strong>
            </p>
          </div>

          <span className="candidate-status-badge">Verified</span>
        </div>

        <div className="content-type-switcher" role="tablist">
          <button
            className={`content-type-tab ${
              activeType === "mock" ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={activeType === "mock"}
            onClick={() => setActiveType("mock")}
          >
            Mock
          </button>

          <button
            className={`content-type-tab ${
              activeType === "test" ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={activeType === "test"}
            onClick={() => setActiveType("test")}
          >
            Test
          </button>
        </div>

        {activeType === "mock" ? (
          <section className="student-selection-section">
            <div className="student-section-heading">
              <p className="section-label section-label-light">
                MOCK ACCESS
              </p>

              <h2>Enter a Mock passcode</h2>

              <p>
                Use the unique passcode provided by your instructor to unlock a
                published Mock.
              </p>
            </div>

            <div className="student-access-card">
              <label htmlFor="mock-passcode">Mock passcode</label>

              <input
                id="mock-passcode"
                type="text"
                placeholder="Enter Mock passcode"
              />

              <button className="dashboard-primary-button" type="button">
                Unlock Mock
              </button>
            </div>
          </section>
        ) : (
          <section className="student-selection-section">
            <div className="student-section-heading">
              <p className="section-label section-label-light">
                TEST ACCESS
              </p>

              <h2>Choose a published Test</h2>

              <p>
                Select a published Test, then enter its unique passcode.
              </p>
            </div>

            <div className="student-empty-card">
              <div className="empty-icon">+</div>

              <h2>No published Tests available</h2>

              <p>
                Published Tests will appear here when they are ready for
                Candidates.
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
    }
