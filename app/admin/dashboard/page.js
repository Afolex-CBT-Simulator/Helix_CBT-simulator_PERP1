"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [activeType, setActiveType] = useState("mock");

  const isMockView = activeType === "mock";

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
              !isMockView ? "content-type-tab-active" : ""
            }`}
            type="button"
            role="tab"
            aria-selected={!isMockView}
            onClick={() => setActiveType("test")}
          >
            Test
          </button>
        </div>

        {isMockView ? <MockDashboardView /> : <TestDashboardView />}
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
            Create a Mock where students select exactly four synced subjects.
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
          <span className="stat-note">Available to students</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Mock Attempts</span>
          <strong>0</strong>
          <span className="stat-note">Student activity</span>
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
            publish settings.
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
          <span className="stat-note">Available to students</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Test Attempts</span>
          <strong>0</strong>
          <span className="stat-note">Student activity</span>
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
