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

export default function TestSetupPage() {
  const [testName, setTestName] = useState("");
  const [testMode, setTestMode] = useState("cbt");
  const [maxSwitches, setMaxSwitches] = useState("3");
  const [countdown, setCountdown] = useState("10");

  const [subject, setSubject] = useState("");
  const [subjectMode, setSubjectMode] = useState("");
  const [subjectTime, setSubjectTime] = useState("");
  const [fileName, setFileName] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [savedSubjects, setSavedSubjects] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const unusedSubjects = subjects.filter(
    (item) => !savedSubjects.some((saved) => saved.name === item),
  );

  function resetSubjectForm() {
    setSubject("");
    setSubjectMode("");
    setSubjectTime("");
    setFileName("");
    setQuestionCount("");
    setDifficulty("");
    setError("");
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    resetSubjectForm();
  }

  function chooseFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    const validType = /.(pdf|docx|txt)$/i.test(file.name);

    if (!validType) {
      event.target.value = "";
      setFileName("");
      setError("Only PDF, DOCX, and TXT files are accepted.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
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
      setError("Please select Imported or Generate from Notes.");
      return;
    }

    if (!fileName) {
      setError("Please select a PDF, DOCX, or TXT file.");
      return;
    }

    if (!subjectTime || Number(subjectTime) < 1) {
      setError("Please enter a valid time allocation.");
      return;
    }

    if (subjectMode === "generated" && Number(questionCount) < 1) {
      setError("Please enter the number of questions to generate.");
      return;
    }

    if (subjectMode === "generated" && !difficulty) {
      setError("Please select a difficulty.");
      return;
    }

    setSavedSubjects([
      ...savedSubjects,
      {
        name: subject,
        mode: subjectMode,
        time: subjectTime,
        fileName,
        questionCount:
          subjectMode === "generated" ? questionCount : "From file",
        difficulty:
          subjectMode === "generated" ? difficulty : "Manual tag optional",
      },
    ]);

    closeSubjectForm();
  }

  function removeSubject(name) {
    setSavedSubjects(
      savedSubjects.filter((savedSubject) => savedSubject.name !== name),
    );
  }

  function saveTest(event) {
    event.preventDefault();

    if (!testName.trim()) {
      setError("Please enter a Test name.");
      return;
    }

    if (savedSubjects.length === 0) {
      setError("Please add at least one subject.");
      return;
    }

    if (Number(maxSwitches) < 0) {
      setError("Maximum tab switches cannot be negative.");
      return;
    }

    if (Number(countdown) < 1) {
      setError("Return countdown must be at least one second.");
      return;
    }

    setError("");
    setSuccess("Test settings saved locally for review.");
  }

  return (
    <main className="mock-setup-page">
      <header className="setup-header">
        <div>
          <Link href="/admin/dashboard" className="setup-back-link">
            ← Back to dashboard
          </Link>

          <p className="setup-kicker">TEST SETUP</p>

          <h1>Create a Test</h1>

          <p className="setup-description">
            Build a flexible single- or multi-subject practice simulation.
          </p>
        </div>

        <span className="draft-badge">Draft</span>
      </header>

      <section className="setup-content">
        <form onSubmit={saveTest}>
          <section className="test-settings-card">
            <p className="section-label section-label-light">STEP 1</p>

            <h2>Test details</h2>

            <label className="create-mock-label" htmlFor="test-name">
              Test name
            </label>

            <input
              id="test-name"
              className="create-mock-input"
              type="text"
              value={testName}
              onChange={(event) => {
                setTestName(event.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Example: Physics Practice Set 1"
            />

            <div className="test-mode-heading">
              <p className="section-label section-label-light">TEST MODE</p>

              <p>
                Choose when the correct answer and explanation are displayed.
              </p>
            </div>

            <div className="test-mode-options">
              <label
                className={`test-mode-option ${
                  testMode === "study" ? "test-mode-option-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="test-mode"
                  value="study"
                  checked={testMode === "study"}
                  onChange={(event) => setTestMode(event.target.value)}
                />

                <span>
                  <strong>Study Mode</strong>
                  <small>Show correction immediately after each answer.</small>
                </span>
              </label>

              <label
                className={`test-mode-option ${
                  testMode === "cbt" ? "test-mode-option-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="test-mode"
                  value="cbt"
                  checked={testMode === "cbt"}
                  onChange={(event) => setTestMode(event.target.value)}
                />

                <span>
                  <strong>CBT Mode</strong>
                  <small>Show correction after submission or time expiry.</small>
                </span>
              </label>
            </div>

            <div className="tab-policy-heading">
              <p className="section-label section-label-light">
                TAB-SWITCH POLICY
              </p>

              <p>
                These settings will be copied to each Attempt at its start.
              </p>
            </div>

            <div className="tab-policy-grid">
              <div>
                <label className="create-mock-label" htmlFor="max-switches">
                  Max Tab Switches Allowed
                </label>

                <input
                  id="max-switches"
                  className="create-mock-input"
                  type="number"
                  min="0"
                  value={maxSwitches}
                  onChange={(event) => {
                    setMaxSwitches(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
              </div>

              <div>
                <label className="create-mock-label" htmlFor="countdown">
                  Return Countdown in Seconds
                </label>

                <input
                  id="countdown"
                  className="create-mock-input"
                  type="number"
                  min="1"
                  value={countdown}
                  onChange={(event) => {
                    setCountdown(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                />
              </div>
            </div>
          </section>

          <section className="test-subjects-section">
            <div className="section-heading-row">
              <div>
                <p className="section-label section-label-light">STEP 2</p>

                <h2>Add subject(s)</h2>
              </div>

              <button
                className="dashboard-primary-button setup-add-button"
                type="button"
                onClick={() => {
                  resetSubjectForm();
                  setShowSubjectForm(true);
                }}
                disabled={unusedSubjects.length === 0}
              >
                + Add Subject
              </button>
            </div>

            {savedSubjects.length === 0 ? (
              <div className="setup-empty-card">
                <div className="empty-icon">+</div>

                <h2>No subjects added</h2>

                <p>
                  Add at least one subject before saving this Test.
                </p>

                <button
                  className="dashboard-secondary-button"
                  type="button"
                  onClick={() => {
                    resetSubjectForm();
                    setShowSubjectForm(true);
                  }}
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

                        <p>
                          {savedSubject.mode === "imported"
                            ? "Imported question file"
                            : "Generated from notes"}
                        </p>
                      </div>

                      <span className="subject-status-badge">Draft</span>
                    </div>

                    <div className="subject-details">
                      <span>
                        Mode:{" "}
                        <strong>
                          {savedSubject.mode === "imported"
                            ? "Imported"
                            : "AI Generated"}
                        </strong>
                      </span>

                      <span>
                        Questions:{" "}
                        <strong>{savedSubject.questionCount}</strong>
                      </span>

                      <span>
                        Difficulty:{" "}
                        <strong>{savedSubject.difficulty}</strong>
                      </span>

                      <span>
                        Time: <strong>{savedSubject.time} minutes</strong>
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

                      <button
                        className="subject-review-button"
                        type="button"
                      >
                        Configure
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
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

          <div className="test-save-actions">
            <button className="dashboard-primary-button" type="submit">
              Save Test Settings
            </button>
          </div>
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
              <label className="create-mock-label" htmlFor="subject">
                Subject
              </label>

              <select
                id="subject"
                className="create-mock-input"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setError("");
                }}
              >
                <option value="">Select a subject</option>

                {unusedSubjects.map((item) => (
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
                    name="subject-mode"
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
                      Upload complete questions, answers, and explanations.
                    </small>
                  </span>
                </label>

                <label className="mode-option">
                  <input
                    type="radio"
                    name="subject-mode"
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

              <label className="create-mock-label" htmlFor="subject-file">
                Upload file
              </label>

              <input
                id="subject-file"
                className="create-mock-input file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={chooseFile}
              />

              <p className="file-help-text">
                Accepted formats: PDF, DOCX, or TXT. Maximum size: 10 MB.
              </p>

              {fileName && (
                <p className="selected-file-text">
                  Selected file: {fileName}
                </p>
              )}

              {subjectMode === "generated" && (
                <div className="generated-settings">
                  <label
                    className="create-mock-label"
                    htmlFor="question-count"
                  >
                    Number of questions
                  </label>

                  <input
                    id="question-count"
                    className="create-mock-input"
                    type="number"
                    min="1"
                    value={questionCount}
                    onChange={(event) => {
                      setQuestionCount(event.target.value);
                      setError("");
                    }}
                    placeholder="Example: 30"
                  />

                  <label
                    className="create-mock-label"
                    htmlFor="difficulty"
                  >
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
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

              <label className="create-mock-label" htmlFor="subject-time">
                Time allocation in minutes
              </label>

              <input
                id="subject-time"
                className="create-mock-input"
                type="number"
                min="1"
                value={subjectTime}
                onChange={(event) => {
                  setSubjectTime(event.target.value);
                  setError("");
                }}
                placeholder="Example: 30"
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
