"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [mockName, setMockName] = useState("");
  const [mockCreated, setMockCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function openCreateForm() {
    setShowCreateForm(true);
    setErrorMessage("");
  }

  function closeCreateForm() {
    setShowCreateForm(false);
    setMockName("");
    setErrorMessage("");
  }

  function handleCreateMock(event) {
    event.preventDefault();

    if (mockName.trim() === "") {
      setErrorMessage("Please enter a name for the mock.");
      return;
    }

    setMockCreated(true);
    setShowCreateForm(false);
    setErrorMessage("");
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">HELIX ACADEMY</p>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Create, publish, and monitor your CBT mock examinations.
          </p>
        </div>

        <Link href="/" className="dashboard-home-link">
          Back to home
        </Link>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-welcome-card">
          <div>
            <p className="section-label">MOCK DASHBOARD</p>
            <h2>Welcome to your simulator workspace</h2>
            <p>
              Your published and draft mock examinations will appear here.
            </p>
          </div>

          <button
            className="dashboard-primary-button"
            type="button"
            onClick={openCreateForm}
          >
            + Create New Mock
          </button>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <span className="stat-label">Total Mocks</span>
            <strong>{mockCreated ? "1" : "0"}</strong>
            <span className="stat-note">Mocks created</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">Published Mocks</span>
            <strong>0</strong>
            <span className="stat-note">Ready to share</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">Total Attempts</span>
            <strong>0</strong>
            <span className="stat-note">Student activity</span>
          </article>
        </div>

        {mockCreated ? (
          <section className="mock-list-section">
            <div className="section-heading-row">
              <div>
                <p className="section-label section-label-light">
                  YOUR MOCKS
                </p>
                <h2>Mock examinations</h2>
              </div>

              <button
                className="dashboard-outline-button"
                type="button"
                onClick={openCreateForm}
              >
                + Add Mock
              </button>
            </div>

            <article className="mock-list-card">
              <div className="mock-list-main">
                <div className="mock-status-dot"></div>

                <div>
                  <h3>{mockName}</h3>
                  <p>Draft · No subjects added yet</p>
                </div>
              </div>

              <Link
                href="/admin/dashboard/mock"
                className="mock-edit-button"
              >
                Continue setup
              </Link>
            </article>
          </section>
        ) : (
          <section className="empty-dashboard-card">
            <div className="empty-icon">+</div>
            <h2>No mock examinations yet</h2>
            <p>
              Create your first mock to begin adding subjects and questions.
            </p>
            <button
              className="dashboard-secondary-button"
              type="button"
              onClick={openCreateForm}
            >
              Create Your First Mock
            </button>
          </section>
        )}
      </section>

      {showCreateForm && (
        <div className="dashboard-modal-overlay">
          <section className="create-mock-modal">
            <button
              className="create-modal-close"
              type="button"
              onClick={closeCreateForm}
              aria-label="Close create mock form"
            >
              ×
            </button>

            <p className="section-label section-label-dark">STEP 1</p>

            <h2>Create a new mock</h2>

            <p className="create-modal-description">
              Give this mock a clear name. You can add subjects and questions
              after creating it.
            </p>

            <form onSubmit={handleCreateMock}>
              <label className="create-mock-label" htmlFor="mock-name">
                Mock name
              </label>

              <input
                id="mock-name"
                className="create-mock-input"
                type="text"
                value={mockName}
                onChange={(event) => {
                  setMockName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: Mock 1.0"
                autoFocus
              />

              {errorMessage && (
                <p className="create-mock-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="create-modal-actions">
                <button
                  className="create-cancel-button"
                  type="button"
                  onClick={closeCreateForm}
                >
                  Cancel
                </button>

                <button className="create-submit-button" type="submit">
                  Create Mock
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}              <div className="mock-list-main">
                <div className="mock-status-dot"></div>

                <div>
                  <h3>{mockName}</h3>
                  <p>Draft · No subjects added yet</p>
                </div>
              </div>

              <button className="mock-edit-button" type="button">
                Continue setup
              </button>
            </article>
          </section>
        ) : (
          <section className="empty-dashboard-card">
            <div className="empty-icon">+</div>
            <h2>No mock examinations yet</h2>
            <p>
              Create your first mock to begin adding subjects and questions.
            </p>
            <button
              className="dashboard-secondary-button"
              type="button"
              onClick={openCreateForm}
            >
              Create Your First Mock
            </button>
          </section>
        )}
      </section>

      {showCreateForm && (
        <div className="dashboard-modal-overlay">
          <section className="create-mock-modal">
            <button
              className="create-modal-close"
              type="button"
              onClick={closeCreateForm}
              aria-label="Close create mock form"
            >
              ×
            </button>

            <p className="section-label section-label-dark">STEP 1</p>

            <h2>Create a new mock</h2>

            <p className="create-modal-description">
              Give this mock a clear name. You can add subjects and questions
              after creating it.
            </p>

            <form onSubmit={handleCreateMock}>
              <label className="create-mock-label" htmlFor="mock-name">
                Mock name
              </label>

              <input
                id="mock-name"
                className="create-mock-input"
                type="text"
                value={mockName}
                onChange={(event) => {
                  setMockName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: Mock 1.0"
                autoFocus
              />

              {errorMessage && (
                <p className="create-mock-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="create-modal-actions">
                <button
                  className="create-cancel-button"
                  type="button"
                  onClick={closeCreateForm}
                >
                  Cancel
                </button>

                <button className="create-submit-button" type="submit">
                  Create Mock
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
                  }
