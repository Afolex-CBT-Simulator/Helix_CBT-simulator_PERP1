"use client";

import Link from "next/link";
import { useState } from "react";

const availableSubjects = [
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

const acceptedFileTypes = ".pdf,.docx,.txt";
const maximumFileSize = 10 * 1024 * 1024;

export default function MockSetupPage() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mode, setMode] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [timeAllocated, setTimeAllocated] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedDifficulty, setImportedDifficulty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function openSubjectForm() {
    setShowSubjectForm(true);
    setSelectedSubject("");
    setMode("");
    setDifficulty("");
    setQuestionCount("");
    setTimeAllocated("");
    setSelectedFile(null);
    setImportedDifficulty("");
    setErrorMessage("");
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    setErrorMessage("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > maximumFileSize) {
      setSelectedFile(null);
      setErrorMessage("The file must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    const validExtension = /.(pdf|docx|txt)$/i.test(file.name);

    if (!validExtension) {
      setSelectedFile(null);
      setErrorMessage("Only PDF, DOCX, and TXT files are accepted.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setErrorMessage("");
  }

  function saveSubject(event) {
    event.preventDefault();

    if (!selectedSubject) {
      setErrorMessage("Please select a subject.");
      return;
    }

    if (!mode) {
      setErrorMessage("Please select how you are providing questions.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please upload a file for this subject.");
      return;
    }

    if (!timeAllocated || Number(timeAllocated) <= 0) {
      setErrorMessage("Please enter a valid time allocation.");
      return;
    }

    if (mode === "generated") {
      if (!questionCount || Number(questionCount) <= 0) {
        setErrorMessage("Please enter the number of questions to generate.");
        return;
      }

      if (!difficulty) {
        setErrorMessage("Please select a generation difficulty.");
        return;
      }
    }

    const subjectAlreadyAdded = selectedSubjects.some(
      (subject) => subject.name === selectedSubject,
    );

    if (subjectAlreadyAdded) {
      setErrorMessage("This subject has already been added.");
      return;
    }

    setSelectedSubjects([
      ...selectedSubjects,
      {
        name: selectedSubject,
        mode,
        difficulty: mode === "generated" ? difficulty : importedDifficulty,
        questionCount: mode === "generated" ? questionCount : "",
        time: timeAllocated,
        fileName: selectedFile.name,
        status: "Draft",
      },
    ]);

    setShowSubjectForm(false);
    setSelectedSubject("");
    setMode("");
    setDifficulty("");
    setQuestionCount("");
    setTimeAllocated("");
    setSelectedFile(null);
    setImportedDifficulty("");
    setErrorMessage("");
  }

  function removeSubject(subjectName) {
    setSelectedSubjects(
      selectedSubjects.filter((subject) => subject.name !== subjectName),
    );
  }

  const availableSubjectOptions = availableSubjects.filter(
    (subject) =>
      !selectedSubjects.some((selected) => selected.name === subject),
  );

  return (
    <main className="mock-setup-page">
      <header className="setup-header">
        <div>
          <Link href="/admin/dashboard" className="setup-back-link">
            ← Back to dashboard
          </Link>

          <p className="setup-kicker">MOCK SETUP</p>

          <h1>Mock 1.0</h1>

          <p className="setup-description">
            Add subjects and configure how each question bank will be
            provided.
          </p>
        </div>

        <span className="draft-badge">Draft</span>
      </header>

      <section className="setup-content">
        <div className="setup-step-card">
          <div className="step-number">1</div>

          <div>
            <p className="step-label">CURRENT STEP</p>

            <h2>Add subjects to this mock</h2>

            <p>
              A mock must have at least four synced subjects before it can be
              published.
            </p>
          </div>
        </div>

        <section className="subjects-section">
          <div className="section-heading-row">
            <div>
              <p className="section-label section-label-light">
                SUBJECT CONFIGURATION
              </p>

              <h2>Subjects</h2>
            </div>

            <button
              className="dashboard-primary-button setup-add-button"
              type="button"
              onClick={openSubjectForm}
              disabled={availableSubjectOptions.length === 0}
            >
              + Add Subject
            </button>
          </div>

          {selectedSubjects.length === 0 ? (
            <div className="setup-empty-card">
              <div className="empty-icon">+</div>

              <h2>No subjects added</h2>

              <p>
                Add Mathematics, English, or another approved subject to begin
                configuring this mock.
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
              {selectedSubjects.map((subject) => (
                <article className="subject-config-card" key={subject.name}>
                  <div className="subject-card-heading">
                    <div>
                      <h3>{subject.name}</h3>

                      <p>
                        {subject.mode === "imported"
                          ? "Imported question file"
                          : "Generated from notes"}
                      </p>
                    </div>

                    <span className="subject-status-badge">
                      {subject.status}
                    </span>
                  </div>

                  <div className="subject-details">
                    <span>
                      Mode:{" "}
                      <strong>
                        {subject.mode === "imported"
                          ? "Imported"
                          : "AI Generated"}
                      </strong>
                    </span>

                    {subject.difficulty && (
                      <span>
                        Difficulty: <strong>{subject.difficulty}</strong>
                      </span>
                    )}

                    {subject.questionCount && (
                      <span>
                        Questions: <strong>{subject.questionCount}</strong>
                      </span>
                    )}

                    <span>
                      Time: <strong>{subject.time} minutes</strong>
                    </span>

                    <span>
                      File: <strong>{subject.fileName}</strong>
                    </span>
                  </div>

                  <div className="subject-card-actions">
                    <button
                      className="subject-remove-button"
                      type="button"
                      onClick={() => removeSubject(subject.name)}
                    >
                      Remove
                    </button>

                    <button className="subject-review-button" type="button">
                      Configure
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="setup-next-step-card">
          <div>
            <p className="section-label section-label-light">NEXT STEP</p>

            <h2>Preview and sync subjects</h2>

            <p>
              Subject review, question validation, and synchronization will be
              added next.
            </p>
          </div>

          <button
            className="dashboard-primary-button"
            type="button"
            disabled={selectedSubjects.length < 4}
          >
            Continue to Review
          </button>
        </section>
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
              Choose the subject first, then select how questions will be
              provided.
            </p>

            <form onSubmit={saveSubject}>
              <label className="create-mock-label" htmlFor="subject">
                Subject
              </label>

              <select
                id="subject"
                className="create-mock-input"
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setErrorMessage("");
                }}
              >
                <option value="">Select a subject</option>

                {availableSubjectOptions.map((subject) => (
                  <option value={subject} key={subject}>
                    {subject}
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
                    name="question-mode"
                    value="imported"
                    checked={mode === "imported"}
                    onChange={(event) => {
                      setMode(event.target.value);
                      setDifficulty("");
                      setQuestionCount("");
                      setErrorMessage("");
                    }}
                  />

                  <span>
                    <strong>Import Ready-Made</strong>

                    <small>
                      Upload a complete question file with answers and
                      explanations.
                    </small>
                  </span>
                </label>

                <label className="mode-option">
                  <input
                    type="radio"
                    name="question-mode"
                    value="generated"
                    checked={mode === "generated"}
                    onChange={(event) => {
                      setMode(event.target.value);
                      setErrorMessage("");
                    }}
                  />

                  <span>
                    <strong>Generate from Notes</strong>

                    <small>
                      Upload notes and let the Neural Engine create questions.
                    </small>
                  </span>
                </label>
              </fieldset>

              <label className="create-mock-label" htmlFor="subject-file">
                {mode === "generated"
                  ? "Notes/content file"
                  : "Ready-made question file"}
              </label>

              <input
                id="subject-file"
                className="create-mock-input file-input"
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
              />

              <p className="file-help-text">
                Accepted formats: PDF, DOCX, or TXT. Maximum size: 10 MB.
              </p>

              {selectedFile && (
                <p className="selected-file-text">
                  Selected file: {selectedFile.name}
                </p>
              )}

              {mode === "imported" && (
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

              {mode === "generated" && (
                <div className="generated-settings">
                  <label className="create-mock-label" htmlFor="question-count">
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
                      setErrorMessage("");
                    }}
                    placeholder="Example: 40"
                  />

                  <label className="create-mock-label" htmlFor="difficulty">
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    className="create-mock-input"
                    value={difficulty}
                    onChange={(event) => {
                      setDifficulty(event.target.value);
                      setErrorMessage("");
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

              <label className="create-mock-label" htmlFor="time-allocated">
                Time allocation in minutes
              </label>

              <input
                id="time-allocated"
                className="create-mock-input"
                type="number"
                min="1"
                value={timeAllocated}
                onChange={(event) => {
                  setTimeAllocated(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: 45"
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
