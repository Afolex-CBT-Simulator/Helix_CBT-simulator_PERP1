"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
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

          <button className="dashboard-primary-button" type="button">
            + Create New Mock
          </button>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <span className="stat-label">Total Mocks</span>
            <strong>0</strong>
            <span className="stat-note">No mocks created yet</span>
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

        <section className="empty-dashboard-card">
          <div className="empty-icon">+</div>
          <h2>No mock examinations yet</h2>
          <p>
            Create your first mock to begin adding subjects and questions.
          </p>
          <button className="dashboard-secondary-button" type="button">
            Create Your First Mock
          </button>
        </section>
      </section>
    </main>
  );
    }
