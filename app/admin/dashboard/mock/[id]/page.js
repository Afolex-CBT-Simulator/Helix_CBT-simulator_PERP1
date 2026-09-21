"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "../../../../../lib/supabase/client";

export default function MockDetailPage() {
  const params = useParams();
  const mockId = params?.id;

  const [mock, setMock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMock() {
      if (!mockId) {
        return;
      }

      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from("mocks")
          .select(
            "id, name, status, passcode, max_tab_switches_allowed, return_countdown_seconds, created_at",
          )
          .eq("id", mockId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setErrorMessage("This Mock could not be found.");
          return;
        }

        setMock(data);
      } catch (error) {
        setErrorMessage(error.message || "Could not load this Mock.");
      } finally {
        setLoading(false);
      }
    }

    loadMock();
  }, [mockId]);

  if (loading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-content">
          <div className="dashboard-empty-state">
            <p>Loading Mock...</p>
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-content">
          <div className="dashboard-empty-state">
            <p className="create-mock-error" role="alert">
              {errorMessage}
            </p>

            <Link
              href="/admin/dashboard"
              className="dashboard-secondary-link"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">HELIX ACADEMY</p>

          <h1>{mock.name}</h1>

          <p className="dashboard-subtitle">
            Mock detail page and configuration container.
          </p>
        </div>

        <Link href="/admin/dashboard" className="dashboard-home-link">
          Back to dashboard
        </Link>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-welcome-card">
          <div>
            <p className="section-label">MOCK DETAIL</p>

            <h2>{mock.name}</h2>

            <p>
              This page is scoped to this Mock. Future Mock configuration will
              be added here.
            </p>
          </div>

          <span className="mock-status-badge">{mock.status}</span>
        </div>

        <section className="dashboard-list-section">
          <div className="dashboard-list-heading">
            <div>
              <p className="section-label section-label-light">
                CONFIGURATION
              </p>

              <h2>Mock setup</h2>
            </div>
          </div>

          <div className="dashboard-empty-state">
            <div className="empty-icon">+</div>

            <h2>Mock configuration starts here</h2>

            <p>
              Subjects, import or generate mode, sync controls, preview mode,
              tab-switch rules, and publishing will be added to this page in
              future steps.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
        }
