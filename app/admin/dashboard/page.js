"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const candidateStorageKey = "helix_registered_candidates";

const defaultCandidates = [
  {
    id: "candidate-1",
    fullName: "Sample Candidate",
    candidateId: "HOT2027001",
  },
];

function normalizeCandidateId(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function loadCandidates() {
  if (typeof window === "undefined") {
    return defaultCandidates;
  }

  const savedCandidates = window.localStorage.getItem(candidateStorageKey);

  if (!savedCandidates) {
    window.localStorage.setItem(
      candidateStorageKey,
      JSON.stringify(defaultCandidates),
    );

    return defaultCandidates;
  }

  try {
    const parsedCandidates = JSON.parse(savedCandidates);

    if (!Array.isArray(parsedCandidates)) {
      return defaultCandidates;
    }

    return parsedCandidates;
  } catch {
    window.localStorage.setItem(
      candidateStorageKey,
      JSON.stringify(defaultCandidates),
    );

    return defaultCandidates;
  }
}

function saveCandidates(candidates) {
  window.localStorage.setItem(
    candidateStorageKey,
    JSON.stringify(candidates),
  );
}

export default function AdminDashboardPage() {
  const [activeType, setActiveType] = useState("mock");

  const isMockView = activeType === "mock";
  const isTestView = activeType === "test";
  const isCandidateView = activeType === "candidates";

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">HELIX ACADEMY</p>

          <h1>Admin Dashboard</h1>

          <p className="dashboard-subtitle">
            Create, configure, publish, and monitor your CBT content.
          </p>
        </div>

        <Link href="/" className="dashboard-home-link">
          Back to home
        </Link>
      </header>

      <section className="dashboard-content">
        <div className="content-type-switcher" role="tablist">
          <button
            className={`content-type-tab ${
              isMockView ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={isMockView}
            onClick={() => setActiveType("mock")}
          >
            Mock
          </button>

          <button
            className={`content-type-tab ${
              isTestView ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={isTestView}
            onClick={() => setActiveType("test")}
          >
            Test
          </button>

          <button
            className={`content-type-tab ${
              isCandidateView ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={isCandidateView}
            onClick={() => setActiveType("candidates")}
          >
            Candidates
          </button>
        </div>

        {isMockView && <MockDashboardView />}

        {isTestView && <TestDashboardView />}

        {isCandidateView && <CandidateManagementView />}
      </section>
    </main>
  );
}

function MockDashboardView() {
  return (
    <>
      <div className="dashboard-welcome-card">
        <div>
          <p className="section-label">MOCK DASHBOARD</p>

          <h2>Full four-subject exam simulations</h2>

          <p>
            Create a Mock where Candidates select exactly four synced subjects.
          </p>
        </div>

        <Link
          href="/admin/dashboard/mock"
          className="dashboard-primary-button dashboard-action-link"
        >
          Create New Mock
        </Link>
      </div>

      <div className="dashboard-stats">
        <article className="stat-card">
          <span className="stat-label">Total Mocks</span>
          <strong>0</strong>
          <span className="stat-note">Draft and published</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Published Mocks</span>
          <strong>0</strong>
          <span className="stat-note">Available to Candidates</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Mock Attempts</span>
          <strong>0</strong>
          <span className="stat-note">Candidate activity</span>
        </article>
      </div>

      <section className="dashboard-list-section">
        <div className="dashboard-list-heading">
          <div>
            <p className="section-label section-label-light">MOCKS</p>
            <h2>Your Mock examinations</h2>
          </div>

          <span className="dashboard-count-badge">0 items</span>
        </div>

        <div className="dashboard-empty-state">
          <div className="empty-icon">+</div>

          <h2>No Mocks created yet</h2>

          <p>
            Create a Mock to begin adding subjects, question banks, and
            publishing settings.
          </p>

          <Link
            href="/admin/dashboard/mock"
            className="dashboard-secondary-link"
          >
            Start a Mock
          </Link>
        </div>
      </section>
    </>
  );
}

function TestDashboardView() {
  return (
    <>
      <div className="dashboard-welcome-card">
        <div>
          <p className="section-label">TEST DASHBOARD</p>

          <h2>Flexible single or multi-subject practice</h2>

          <p>
            Create a Test with one or more subjects in Study Mode or CBT Mode.
          </p>
        </div>

        <Link
          href="/admin/dashboard/test"
          className="dashboard-primary-button dashboard-action-link"
        >
          Create New Test
        </Link>
      </div>

      <div className="dashboard-stats">
        <article className="stat-card">
          <span className="stat-label">Total Tests</span>
          <strong>0</strong>
          <span className="stat-note">Draft and published</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Published Tests</span>
          <strong>0</strong>
          <span className="stat-note">Available to Candidates</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Test Attempts</span>
          <strong>0</strong>
          <span className="stat-note">Candidate activity</span>
        </article>
      </div>

      <section className="dashboard-list-section">
        <div className="dashboard-list-heading">
          <div>
            <p className="section-label section-label-light">TESTS</p>
            <h2>Your practice Tests</h2>
          </div>

          <span className="dashboard-count-badge">0 items</span>
        </div>

        <div className="dashboard-empty-state">
          <div className="empty-icon">+</div>

          <h2>No Tests created yet</h2>

          <p>
            Create a Test to configure subjects, mode, timing, and tab-switch
            protection.
          </p>

          <Link
            href="/admin/dashboard/test"
            className="dashboard-secondary-link"
          >
            Start a Test
          </Link>
        </div>
      </section>
    </>
  );
}

function CandidateManagementView() {
  const [candidates, setCandidates] = useState(defaultCandidates);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!hasLoaded && typeof window !== "undefined") {
    const storedCandidates = loadCandidates();
    setCandidates(storedCandidates);
    setHasLoaded(true);
  }

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return candidates;
    }

    return candidates.filter(
      (candidate) =>
        candidate.fullName.toLowerCase().includes(normalizedSearch) ||
        candidate.candidateId.toLowerCase().includes(normalizedSearch),
    );
  }, [candidates, searchTerm]);

  function resetForm() {
    setFullName("");
    setCandidateId("");
    setErrorMessage("");
  }

  function closeForm() {
    setShowAddForm(false);
    resetForm();
  }

  function addCandidate(event) {
    event.preventDefault();

    const cleanedName = fullName.trim().replace(/s+/g, " ");
    const normalizedId = normalizeCandidateId(candidateId);

    if (!cleanedName) {
      setErrorMessage("Please enter the Candidate Full Name.");
      return;
    }

    if (!normalizedId) {
      setErrorMessage("Please enter the Candidate ID.");
      return;
    }

    const duplicate = candidates.some(
      (candidate) => candidate.candidateId === normalizedId,
    );

    if (duplicate) {
      setErrorMessage(
        "This Candidate ID already exists in the registered roster.",
      );
      return;
    }

    const updatedCandidates = [
      ...candidates,
      {
        id: `candidate-${Date.now()}`,
        fullName: cleanedName,
        candidateId: normalizedId,
      },
    ];

    setCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
    closeForm();
  }

  function removeCandidate(candidateIdToRemove) {
    const updatedCandidates = candidates.filter(
      (candidate) => candidate.id !== candidateIdToRemove,
    );

    setCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
  }

  return (
    <section className="candidate-management-section">
      <div className="candidate-management-heading">
        <div>
          <p className="section-label section-label-light">
            CANDIDATE MANAGEMENT
          </p>

          <h2>Registered Candidates</h2>

          <p>
            Add and manage Candidates who are allowed to access published
            Mocks and Tests.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          type="button"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          + Add Candidate
        </button>
      </div>

      <div className="candidate-management-tools">
        <label htmlFor="candidate-search">Search roster</label>

        <input
          id="candidate-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by Full Name or Candidate ID"
        />

        <span>{candidates.length} registered</span>
      </div>

      <div className="candidate-roster-card">
        {filteredCandidates.length === 0 ? (
          <div className="candidate-roster-empty">
            <div className="empty-icon">+</div>

            <h3>No matching Candidates</h3>

            <p>
              Add a Candidate or adjust your search to view registered
              records.
            </p>
          </div>
        ) : (
          <div className="candidate-table-wrapper">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Candidate ID</th>
                  <th>Activity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.fullName}</td>

                    <td>
                      <span className="candidate-id-value">
                        {candidate.candidateId}
                      </span>
                    </td>

                    <td>
                      <button
                        className="candidate-history-button"
                        type="button"
                      >
                        View activity
                      </button>
                    </td>

                    <td>
                      <button
                        className="candidate-remove-button"
                        type="button"
                        onClick={() => removeCandidate(candidate.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="dashboard-modal-overlay">
          <section className="create-mock-modal candidate-modal">
            <button
              className="create-modal-close"
              type="button"
              onClick={closeForm}
              aria-label="Close candidate form"
            >
              ×
            </button>

            <p className="section-label section-label-dark">
              MANUAL REGISTRATION
            </p>

            <h2>Add Candidate</h2>

            <p className="create-modal-description">
              Register a Candidate before they can access a Mock or Test.
            </p>

            <form onSubmit={addCandidate}>
              <label className="create-mock-label" htmlFor="candidate-full-name">
                Full Name
              </label>

              <input
                id="candidate-full-name"
                className="create-mock-input"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter Candidate Full Name"
                autoFocus
              />

              <label className="create-mock-label" htmlFor="candidate-id">
                Candidate ID
              </label>

              <input
                id="candidate-id"
                className="create-mock-input"
                type="text"
                value={candidateId}
                onChange={(event) => {
                  setCandidateId(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: HOT-2027-001"
              />

              <p className="candidate-format-help">
                Spacing, casing, and punctuation will be normalized
                automatically.
              </p>

              {errorMessage && (
                <p className="create-mock-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="create-modal-actions">
                <button
                  className="create-cancel-button"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button className="create-submit-button" type="submit">
                  Add Candidate
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
            }
