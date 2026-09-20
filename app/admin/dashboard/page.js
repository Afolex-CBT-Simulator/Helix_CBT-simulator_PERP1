"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const storageKey = "helix_registered_candidates";

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

function readCandidates() {
  if (typeof window === "undefined") {
    return defaultCandidates;
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(defaultCandidates),
    );

    return defaultCandidates;
  }

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : defaultCandidates;
  } catch {
    return defaultCandidates;
  }
}

function writeCandidates(candidates) {
  window.localStorage.setItem(storageKey, JSON.stringify(candidates));
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("mock");

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
        <nav className="content-type-switcher" aria-label="Dashboard sections">
          <button
            className={`content-type-tab ${
              activeTab === "mock" ? "content-type-tab-active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("mock")}
          >
            Mock
          </button>

          <button
            className={`content-type-tab ${
              activeTab === "test" ? "content-type-tab-active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("test")}
          >
            Test
          </button>

          <button
            className={`content-type-tab ${
              activeTab === "candidates"
                ? "content-type-tab-active"
                : ""
            }`}
            type="button"
            onClick={() => setActiveTab("candidates")}
          >
            Candidates
          </button>
        </nav>

        {activeTab === "mock" && <MockSection />}

        {activeTab === "test" && <TestSection />}

        {activeTab === "candidates" && <CandidatesSection />}
      </section>
    </main>
  );
}

function MockSection() {
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

      <EmptyDashboardSection
        label="MOCKS"
        title="Your Mock examinations"
        message="Create a Mock to begin adding subjects, question banks, and publishing settings."
        link="/admin/dashboard/mock"
        linkText="Start a Mock"
      />
    </>
  );
}

function TestSection() {
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

      <EmptyDashboardSection
        label="TESTS"
        title="Your practice Tests"
        message="Create a Test to configure subjects, mode, timing, and tab-switch protection."
        link="/admin/dashboard/test"
        linkText="Start a Test"
      />
    </>
  );
}

function EmptyDashboardSection({
  label,
  title,
  message,
  link,
  linkText,
}) {
  return (
    <section className="dashboard-list-section">
      <div className="dashboard-list-heading">
        <div>
          <p className="section-label section-label-light">{label}</p>
          <h2>{title}</h2>
        </div>

        <span className="dashboard-count-badge">0 items</span>
      </div>

      <div className="dashboard-empty-state">
        <div className="empty-icon">+</div>
        <h2>No {label} created yet</h2>
        <p>{message}</p>

        <Link href={link} className="dashboard-secondary-link">
          {linkText}
        </Link>
      </div>
    </section>
  );
}

function CandidatesSection() {
  const [candidates, setCandidates] = useState(() => readCandidates());
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [fullName, setFullName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [error, setError] = useState("");

  const visibleCandidates = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return candidates;
    }

    return candidates.filter(
      (candidate) =>
        candidate.fullName.toLowerCase().includes(searchValue) ||
        candidate.candidateId.toLowerCase().includes(searchValue),
    );
  }, [candidates, search]);

  function closeForm() {
    setShowForm(false);
    setFullName("");
    setCandidateId("");
    setError("");
  }

  function addCandidate(event) {
    event.preventDefault();

    const cleanedName = fullName.trim().replace(/s+/g, " ");
    const normalizedId = normalizeCandidateId(candidateId);

    if (!cleanedName) {
      setError("Please enter the Candidate Full Name.");
      return;
    }

    if (!normalizedId) {
      setError("Please enter the Candidate ID.");
      return;
    }

    if (candidates.some((candidate) => candidate.candidateId === normalizedId)) {
      setError("This Candidate ID already exists in the registered roster.");
      return;
    }

    const updated = [
      ...candidates,
      {
        id: `candidate-${Date.now()}`,
        fullName: cleanedName,
        candidateId: normalizedId,
      },
    ];

    setCandidates(updated);
    writeCandidates(updated);
    closeForm();
  }

  function removeCandidate(id) {
    const updated = candidates.filter((candidate) => candidate.id !== id);

    setCandidates(updated);
    writeCandidates(updated);
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
            Manage the Candidates who may access published Mocks and Tests.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          type="button"
          onClick={() => {
            setError("");
            setShowForm(true);
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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by Full Name or Candidate ID"
        />

        <span>{candidates.length} registered</span>
      </div>

      <div className="candidate-roster-card">
        {visibleCandidates.length === 0 ? (
          <div className="candidate-roster-empty">
            <div className="empty-icon">+</div>
            <h3>No matching Candidates</h3>
            <p>Try another search or add a new Candidate.</p>
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
                {visibleCandidates.map((candidate) => (
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

      {showForm && (
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
              <label className="create-mock-label" htmlFor="candidate-name">
                Full Name
              </label>

              <input
                id="candidate-name"
                className="create-mock-input"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setError("");
                }}
                placeholder="Enter Candidate Full Name"
                autoFocus
              />

              <label className="create-mock-label" htmlFor="candidate-code">
                Candidate ID
              </label>

              <input
                id="candidate-code"
                className="create-mock-input"
                type="text"
                value={candidateId}
                onChange={(event) => {
                  setCandidateId(event.target.value);
                  setError("");
                }}
                placeholder="Example: HOT-2027-001"
              />

              <p className="candidate-format-help">
                Spacing, casing, and punctuation are normalized automatically.
              </p>

              {error && (
                <p className="create-mock-error" role="alert">
                  {error}
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
