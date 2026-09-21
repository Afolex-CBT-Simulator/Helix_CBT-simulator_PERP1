"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "../../../../../lib/supabase/client";

const SUBJECT_MODES = [
  {
    value: "imported",
    label: "Import",
    description: "Use an existing question source later.",
  },
  {
    value: "generated",
    label: "Generate",
    description: "Generate questions with the Neural Engine later.",
  },
];

export default function MockDetailPage() {
  const params = useParams();
  const mockId = params?.id;

  const [mock, setMock] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectMode, setSubjectMode] = useState("imported");
  const [loading, setLoading] = useState(true);
  const [savingSubject, setSavingSubject] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadMockAndSubjects() {
      if (!mockId) {
        return;
      }

      try {
        const supabase = getSupabaseClient();

        const [
          { data: mockData, error: mockError },
          { data: subjectData, error: subjectError },
        ] = await Promise.all([
          supabase
            .from("mocks")
            .select(
              "id, name, status, passcode, max_tab_switches_allowed, return_countdown_seconds, created_at",
            )
            .eq("id", mockId)
            .maybeSingle(),

          supabase
            .from("subject_configs")
            .select(
              "id, parent_id, parent_type, subject, mode, difficulty, time_allocated, sync_status, source_file_name, created_at",
            )
            .eq("parent_id", mockId)
            .eq("parent_type", "mock")
            .order("created_at", { ascending: true }),
        ]);

        if (mockError) {
          throw mockError;
        }

        if (subjectError) {
          throw subjectError;
        }

        if (!mockData) {
          setErrorMessage("This Mock could not be found.");
          return;
        }

        setMock(mockData);
        setSubjects(subjectData || []);
      } catch (error) {
        setErrorMessage(error.message || "Could not load this Mock.");
      } finally {
        setLoading(false);
      }
    }

    loadMockAndSubjects();
  }, [mockId]);

  async function addSubject(event) {
    event.preventDefault();

    const cleanedSubjectName = subjectName.trim().replace(/s+/g, " ");

    if (!cleanedSubjectName) {
      setErrorMessage("Please enter a subject name.");
      setSuccessMessage("");
      return;
    }

    setSavingSubject(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("subject_configs")
        .insert({
          parent_id: mockId,
          parent_type: "mock",
          subject: cleanedSubjectName,
          mode: subjectMode,
          time_allocated: 1,
          sync_status: "draft",
        })
        .select(
          "id, parent_id, parent_type, subject, mode, difficulty, time_allocated, sync_status, source_file_name, created_at",
        )
        .single();

      if (error) {
        throw error;
      }

      setSubjects((currentSubjects) => [...currentSubjects, data]);
      setSubjectName("");
      setSubjectMode("imported");
      setSuccessMessage("Subject added as Draft.");
    } catch (error) {
      setErrorMessage(error.message || "Could not add this subject.");
    } finally {
      setSavingSubject(false);
    }
  }

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

  if (errorMessage && !mock) {
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
            Configure subjects for this Mock.
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
              This page belongs only to this Mock. Subjects added here will not
              appear under another Mock.
            </p>
          </div>

          <span className="mock-status-badge">{mock.status}</span>
        </div>

        {successMessage && (
          <p className="candidate-upload-success" role="status">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="create-mock-error" role="alert">
            {errorMessage}
          </p>
        )}

        <section className="dashboard-list-section">
          <div className="dashboard-list-heading">
            <div>
              <p className="section-label section-label-light">
                SUBJECT CONFIGURATION
              </p>

              <h2>Add subjects</h2>
            </div>

            <span className="dashboard-count-badge">
              {subjects.length}{" "}
              {subjects.length === 1 ? "subject" : "subjects"}
            </span>
          </div>

          <div className="create-mock-form-card">
            <form onSubmit={addSubject}>
              <label className="create-mock-label" htmlFor="subject-name">
                Subject name
              </label>

              <input
                id="subject-name"
                className="create-mock-input"
                type="text"
                value={subjectName}
                onChange={(event) => {
                  setSubjectName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: Biology"
                maxLength={100}
                disabled={savingSubject}
              />

              <fieldset className="subject-mode-fieldset">
                <legend className="create-mock-label">
                  Question source mode
                </legend>

                <div className="subject-mode-options">
                  {SUBJECT_MODES.map((mode) => (
                    <label className="subject-mode-option" key={mode.value}>
                      <input
                        type="radio"
                        name="subject-mode"
                        value={mode.value}
                        checked={subjectMode === mode.value}
                        onChange={(event) => {
                          setSubjectMode(event.target.value);
                          setErrorMessage("");
                        }}
                        disabled={savingSubject}
                      />

                      <span>
                        <strong>{mode.label}</strong>
                        <small>{mode.description}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="create-modal-actions">
                <button
                  className="create-submit-button"
                  type="submit"
                  disabled={savingSubject}
                >
                  {savingSubject ? "Saving..." : "Add Subject as Draft"}
                </button>
              </div>
            </form>
          </div>

          <div className="subject-list">
            {subjects.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="empty-icon">+</div>

                <h2>No subjects added yet</h2>

                <p>
                  Add the first subject to begin configuring this Mock.
                </p>
              </div>
            ) : (
              subjects.map((subjectConfig) => (
                <article
                  className="subject-list-item"
                  key={subjectConfig.id}
                >
                  <div>
                    <h3>{subjectConfig.subject}</h3>

                    <p>
                      Mode:{" "}
                      {subjectConfig.mode === "imported"
                        ? "Import"
                        : "Generate"}{" "}
                      · Status: {subjectConfig.sync_status}
                    </p>
                  </div>

                  <span className="mock-status-badge">
                    {subjectConfig.sync_status}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
  }
