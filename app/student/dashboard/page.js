"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboardPage() {
  const [candidate, setCandidate] = useState(null);
  const [activeType, setActiveType] = useState("mock");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCandidate = window.sessionStorage.getItem(
      "helix_candidate_session",
    );

    if (!storedCandidate) {
      window.location.href = "/student";
      return;
    }

    try {
      const parsedCandidate = JSON.parse(storedCandidate);
      setCandidate(parsedCandidate);
    } catch {
      window.sessionStorage.removeItem("helix_candidate_session");
      window.location.href = "/student";
      return;
    }

    setIsLoading(false);
  }, []);

  function exitDashboard() {
    window.sessionStorage.removeItem("helix_candidate_session");
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <main className="candidate-dashboard-page">
        <section className="candidate-dashboard-loading">
          <div className="candidate-loading-mark">H</div>
          <p>Loading Candidate Dashboard</p>
        </section>
      </main>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <main className="candidate-dashboard-page">
      <header className="candidate-dashboard-topbar">
        <div className="candidate-dashboard-brand">
          <div className="candidate-dashboard-mark">H</div>

          <div>
            <p>HELIX ACADEMY</p>
            <span>Student Portal</span>
          </div>
        </div>

        <button
          className="candidate-dashboard-exit"
          type="button"
          onClick={exitDashboard}
        >
          Exit
        </button>
      </header>

      <section className="candidate-dashboard-main">
        <div className="candidate-dashboard-intro">
          <p className="candidate-dashboard-eyebrow">CANDIDATE DASHBOARD</p>

          <h1>Welcome, {candidate.fullName}</h1>

          <p>
            Select a published Mock or Test to continue your preparation.
          </p>
        </div>

        <section className="candidate-identity-card">
          <div>
            <span>REGISTERED CANDIDATE</span>
            <h2>{candidate.fullName}</h2>
            <p>
              Candidate ID: <strong>{candidate.candidateId}</strong>
            </p>
          </div>

          <span className="candidate-verified-badge">Verified</span>
        </section>

        <div className="candidate-type-tabs" role="tablist">
          <button
            className={`candidate-type-tab ${
              activeType === "mock" ? "candidate-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={activeType === "mock"}
            onClick={() => setActiveType("mock")}
          >
            Mock
          </button>

          <button
            className={`candidate-type-tab ${
              activeType === "test" ? "candidate-type-tab-active" : ""
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
          <section className="candidate-access-panel">
            <div className="candidate-panel-heading">
              <span className="candidate-panel-label">MOCK ACCESS</span>

              <h2>Enter a Mock passcode</h2>

              <p>
                Use the unique passcode provided by your instructor to unlock
                a published Mock.
              </p>
            </div>

            <div className="candidate-passcode-box">
              <label htmlFor="mock-passcode">Mock passcode</label>

              <input
                id="mock-passcode"
                type="text"
                placeholder="Enter Mock passcode"
              />

              <button type="button">Unlock Mock</button>
            </div>
          </section>
        ) : (
          <section className="candidate-access-panel">
            <div className="candidate-panel-heading">
              <span className="candidate-panel-label">TEST ACCESS</span>

              <h2>Published Tests</h2>

              <p>
                Select a published Test, then enter its unique passcode.
              </p>
            </div>

            <div className="candidate-empty-panel">
              <div className="candidate-empty-mark">+</div>

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
