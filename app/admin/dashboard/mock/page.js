"use client";

import Link from "next/link";
import { useState } from "react";

const subjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Financial Accounting",
  "Commerce",
  "Literature",
  "Government",
  "CRK",
  "IRS",
];

const maximumFileSize = 10 * 1024 * 1024;

export default function MockSetupPage() {
  const [mockName, setMockName] = useState("Mock 1.0");
  const [maxTabSwitches, setMaxTabSwitches] = useState("3");
  const [returnCountdown, setReturnCountdown] = useState("10");

  const [savedSubjects, setSavedSubjects] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const [subject, setSubject] = useState("");
  const [subjectMode, setSubjectMode] = useState("");
  const [subjectTime, setSubjectTime] = useState("");
  const [fileName, setFileName] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [importedDifficulty, setImportedDifficulty] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableSubjects = subjects.filter(
    (item) => !savedSubjects.some((saved) => saved.name === item),
  );

  const syncedSubjectCount = savedSubjects.filter(
    (savedSubject) => savedSubject.synced,
  ).length;

  function resetSubjectForm() {
setSubject("");
    setSubjectMode("");
    setSubjectTime("");
    setFileName("");
    setQuestionCount("");
    setDifficulty("");
    setImportedDifficulty("");
    setError("");
  }

  function openSubjectForm() {
    resetSubjectForm();
    setShowSubjectForm(true);
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    resetSubjectForm();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    const validFile = /.(pdf|docx|txt)$/i.test(file.name);

    if (!validFile) {
      event.target.value = "";
      setFileName("");
      setError("Only PDF, DOCX, and TXT files are accepted.");
      return;
    }

    if (file.size > maximumFileSize) {
      event.target.value = "";
      setFileName("");
      setError("The file must be 10 MB or smaller.");
      return;
    }

    setFileName(file.name);
    setError("");
  }

  function saveSubject(event) {
    event.preventDefault();

    if (!subject) {
      setError("Please select a subject.");
      return;
    }

    if (!subjectMode) {
      setError("Please choose Imported or Generate from Notes.");
      return;
    }

    if (!fileName) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    if (!subjectTime || Number(subjectTime) < 1) {
      setError("Please enter a valid time allocation.");
      return;
    }

    if (subjectMode === "generated") {
      if (!questionCount || Number(questionCount) < 1) {
        setError("Please enter the number of questions to generate.");
        return;
      }

      if (!difficulty) {
        setError("Please select a generation difficulty.");
        return;
      }
    }

    const newSubject = {
      name: subject,
      mode: subjectMode,
      time: subjectTime,
      fileName,
      questionCount:
        subjectMode === "generated" ? questionCount : "From file",
      difficulty:
        subjectMode === "generated"
          ? difficulty
          : importedDifficulty || "No tag",
      status: "Draft",
      synced: false,
    };

    setSavedSubjects([...savedSubjects, newSubject]);
    closeSubjectForm();
  }

  function toggleSync(subjectName) {
    setSavedSubjects(
      savedSubjects.map((savedSubject) => {
        if (savedSubject.name !== subjectName) {
          return savedSubject;
        }

        if (savedSubject.status !== "Ready" && !savedSubject.synced) {
          return {
            ...savedSubject,
            status: "Ready",
          };
        }

        const nextSynced = !savedSubject.synced;

        return {
          ...savedSubject,
          synced: nextSynced,
          status: nextSynced ? "Synced" : "Ready",
        };
      }),
    );

    setSuccess("");
  }

  function markReady(subjectName) {
    setSavedSubjects(
      savedSubjects.map((savedSubject) =>
        savedSubject.name === subjectName
          ? {
              ...savedSubject,
              status: "Ready",
            }
          : savedSubject,
      ),
    );

    setSuccess("");
  }

  function removeSubject(subjectName) {
    setSavedSubjects(
      savedSubjects.filter((savedSubject) => savedSubject.name !== subjectName),
    );

    setSuccess("");
  }

  function saveMockSettings(event) {
    event.preventDefault();

    if (!mockName.trim()) {
      setError("Please enter a name for the Mock.");
      return;
    }

    if (savedSubjects.length < 4) {
      setError("A Mock needs at least four subjects before publishing.");
      return;
    }

    if (Number(maxTabSwitches) < 0) {
      setError("Maximum tab switches cannot be negative.");
      return;
    }

    if (Number(returnCountdown) < 1) {
      setError("Return countdown must be at least one second.");
      return;
    }

    setError("");
    setSuccess("Mock settings saved locally for review.");
  }

  const canPublish =
    savedSubjects.length >= 4 && syncedSubjectCount >= 4;

  return (
    <main className="mock-setup-page">
      <header className="setup-header">
        <div>
          <Link href="/admin/dashboard" className="setup-back-link">
            ← Back to dashboard
          </Link>

          <p className="setup-kicker">MOCK SETUP</p>

          <h1>{mockName || "New Mock"}</h1>

          <p className="setup-description">
            Build a full four-subject CBT simulation. Students will choose
            exactly four synced subjects before starting.
          </p>
        </div>

        <span className="draft-badge">Draft</span>
      </header>

      <section className="setup-content">
        <form onSubmit={saveMockSettings}>
          <section className="test-settings-card">
            <p className="section-label section-label-light">MOCK DETAILS</p>

            <h2>Mock settings</h2>

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
                setError("");
                setSuccess("");
              }}
              placeholder="Example: Mock 1.0"
            />

            <div className="tab-policy-heading">
              <p className="section-label section-label-light">
                TAB-SWITCH POLICY
              </p>

              <p>
                These settings will be copied to each Attempt when the Mock
                begins.
              </p>
            </div>

            <div className="tab-policy-grid">
              <div>
                <label
                  className="create-mock-label"
                  htmlFor="mock-max-switches"
                >
                  Max Tab Switches Allowed
              </label>

                <input
                  id="mock-max-switches"
                  className="create-mock-input"
                  type="number"
                  min="0"
                  value={maxTabSwitches}
                  onChange={(event) => {
                    setMaxTabSwitches(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
              </div>

              <div>
                <label
                  className="create-mock-label"
                  htmlFor="mock-countdown"
                >
                  Return Countdown in Seconds
                </label>

                <input
                  id="mock-countdown"
                  className="create-mock-input"
                  type="number"
                  min="1"
                  value={returnCountdown}
                  onChange={(event) => {
                    setReturnCountdown(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
              </div>
            </div>
          </section>

          <section className="subjects-section">
                              <div className="section-heading-row">
              <div>
                <p className="section-label section-label-light">
                  SUBJECT CONFIGURATION
                </p>

                <h2>Subjects</h2>

                <p className="setup-counter">
                  {syncedSubjectCount} of 4 synced subjects required for
                  publishing
                </p>
              </div>

              <button
                className="dashboard-primary-button setup-add-button"
                type="button"
                onClick={openSubjectForm}
                disabled={availableSubjects.length === 0}
              >
                + Add Subject
              </button>
            </div>

            {savedSubjects.length === 0 ? (
              <div className="setup-empty-card">
                <div className="empty-icon">+</div>

                <h2>No subjects added</h2>

                <p>
                  Add at least four subjects, then review and mark each one
                  Ready before syncing it.
                </p>

                <button
                  className="dashboard-secondary-button"
                  type="button"
                  onClick={openSubjectForm}
                >
                  Add First Subject
                </button>
              </div>
            ) : (
              <div className="subject-config-list">
                {savedSubjects.map((savedSubject) => (
                  <article
                    className="subject-config-card"
                    key={savedSubject.name}
                  >
                    <div className="subject-card-heading">
                      <div>
                        <h3>{savedSubject.name}</h3>

                        <div className="subject-badge-row">
                          <span className="mode-badge">
                            {savedSubject.mode === "imported"
                              ? "Imported"
                              : "AI Generated"}
                          </span>

                          <span className="subject-status-badge">
                            {savedSubject.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="subject-details">
                      <span>
                        Time: <strong>{savedSubject.time} minutes</strong>
                      </span>

                      <span>
                        Questions:{" "}
                        <strong>{savedSubject.questionCount}</strong>
                      </span>
                      <span>
                        File: <strong>{savedSubject.fileName}</strong>
                      </span>
                    </div>

                    <div className="subject-card-actions">
                      <button
                        className="subject-remove-button"
                        type="button"
                        onClick={() => removeSubject(savedSubject.name)}
                      >
                        Remove
                      </button>

                      {!savedSubject.synced && (
                        <button
                          className="subject-review-button"
                          type="button"
                          onClick={() => markReady(savedSubject.name)}
                        >
                          Mark Ready
                        </button>
                      )}

                      <button
                        className={`sync-toggle ${
                          savedSubject.synced ? "sync-toggle-on" : ""
                        }`}
                        type="button"
                        onClick={() => toggleSync(savedSubject.name)}
                      >
                        {savedSubject.synced ? "Synced" : "Sync ON"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="setup-next-step-card">
            <div>
              <p className="section-label
              section-label-light">PUBLISH</p>

              <h2>
                {canPublish
                  ? "This Mock is ready to publish"
                  : "Mock publishing is locked"}
              </h2>

              <p>
                {canPublish
                  ? "At least four subjects are synced and available."
                  : "You need at least four synced subjects before publishing."}
              </p>
            </div>

            <button
              className="dashboard-primary-button"
              type="submit"
              disabled={!canPublish}
            >
              Publish Mock
            </button>
          </section>

          {error && (
            <p className="create-mock-error test-page-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="login-success test-page-success" role="status">
              {success}
            </p>
          )}
        </form>
      </section>

      {showSubjectForm && (
        <div className="dashboard-modal-overlay">
          <section className="create-mock-modal subject-modal">
            <button
              className="create-modal-close"
              type="button"
              onClick={closeSubjectForm}
              aria-label="Close subject form"
            >
              ×
            </button>

            <p className="section-label section-label-dark">ADD SUBJECT</p>

            <h2>Configure a subject</h2>

            <p className="create-modal-description">
              Choose the subject and how its questions will be provided.
            </p>

            <form onSubmit={saveSubject}>
              <label className="create-mock-label"
       htmlFor="mock-subject">
                Subject
              </label>

              <select
                id="mock-subject"
                className="create-mock-input"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setError("");
                }}
              >
                <option value="">Select a subject</option>

                {availableSubjects.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <fieldset className="mode-fieldset">
                <legend className="create-mock-label">
                  How are you providing questions?
                </legend>

                <label className="mode-option">
                  <input
                    type="radio"
                    name="mock-subject-mode"
                    value="imported"
                    checked={subjectMode === "imported"}
                    onChange={(event) => {
                      setSubjectMode(event.target.value);
                      setQuestionCount("");
                      setDifficulty("");
                      setError("");
                    }}
                  />

                  <span>
                    <strong>Import Ready-Made</strong>

                    <small>
                      Upload complete questions, options, answers, and
                      explanations.
                    </small>
                  </span>
                </label>

                <label className="mode-option">
                  <input
                    type="radio"
                    name="mock-subject-mode"
                    value="generated"
                    checked={subjectMode === "generated"}
                    onChange={(event) => {
                      setSubjectMode(event.target.value);
                      setError("");
                    }}
                  />

                  <span>
                    <strong>Generate from Notes</strong>

                    <small>
                      Upload notes and configure question generation.
                    </small>
                  </span>
                </label>
              </fieldset>

              <label className="create-mock-label" htmlFor="mock-file">
                Upload file
              </label>

              <input
                id="mock-file"
                className="create-mock-input file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />

              <p className="file-help-text">
                Accepted formats: PDF, DOCX, or TXT. Maximum size: 10 MB.
              </p>

              {fileName && (
                <p className="selected-file-text">
                  Selected file: {fileName}
                </p>
              )}

              {subjectMode === "imported" && (
                <div className="imported-settings">
                  <label
                    className="create-mock-label"
                    htmlFor="imported-difficulty"
                  >
                    Optional overall difficulty
                  </label>

                  <select
                    id="imported-difficulty"
                    className="create-mock-input"
                    value={importedDifficulty}
                    onChange={(event) =>
                                          setImportedDifficulty(event.target.value)
                    }
                  >
                    <option value="">No difficulty tag</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advance">Advance</option>
                    <option value="Twister">Twister</option>
                  </select>
                </div>
              )}

              {subjectMode === "generated" && (
                <div className="generated-settings">
                  <label
                    className="create-mock-label"
                    htmlFor="mock-question-count"
                  >
                    Number of questions
                  </label>

                  <input
                    id="mock-question-count"
                    className="create-mock-input"
                    type="number"
                    min="1"
                    value={questionCount}
                    onChange={(event) => {
                      setQuestionCount(event.target.value);
                      setError("");
                    }}
                    placeholder="Example: 40"
                  />

                  <label
                    className="create-mock-label"
                    htmlFor="mock-difficulty"
                  >
                    Difficulty
                  </label>

                  <select
                    id="mock-difficulty"
                    className="create-mock-input"
                    value={difficulty}
                    onChange={(event) => {
                      setDifficulty(event.target.value);
                      setError("");
                    }}
                  >
                    <option value="">Select difficulty</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advance">Advance</option>
                    <option value="Twister">Twister</option>
                  </select>
                </div>
              )}

              <label className="create-mock-label"
htmlFor="mock-time">
                Time allocation in minutes
              </label>

              <input
                id="mock-time"
                className="create-mock-input"
                type="number"
                min="1"
                value={subjectTime}
                onChange={(event) => {
                  setSubjectTime(event.target.value);
                  setError("");
                }}
                placeholder="Example: 45"
              />

              {error && (
                <p className="create-mock-error" role="alert">
                  {error}
                </p>
              )}

              <div className="create-modal-actions">
                <button
                  className="create-cancel-button"
                  type="button"
                  onClick={closeSubjectForm}
                >
                  Cancel
                </button>

                <button className="create-submit-button" type="submit">
                  Save Subject
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
