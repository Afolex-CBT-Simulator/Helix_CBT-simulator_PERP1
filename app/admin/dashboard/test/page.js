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

export default function TestSetupPage() {
  const [testName, setTestName] = useState("");
  const [testMode, setTestMode] = useState("cbt");
  const [maxTabSwitches, setMaxTabSwitches] = useState("3");
  const [returnCountdown, setReturnCountdown] = useState("10");

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectMode, setSubjectMode] = useState("");
  const [timeAllocated, setTimeAllocated] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [fileName, setFileName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const availableSubjectOptions = availableSubjects.filter(
    (subject) =>
      !selectedSubjects.some((selected) => selected.name === subject),
  );

  function openSubjectForm() {
    setShowSubjectForm(true);
    setSelectedSubject("");
    setSubjectMode("");
    setTimeAllocated("");
    setQuestionCount("");
    setDifficulty("");
    setFileName("");
    setErrorMessage("");
    setSavedMessage("");
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    setErrorMessage("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    const validExtension = /.(pdf|docx|txt)$/i.test(file.name);

    if (!validExtension) {
      setFileName("");
      setErrorMessage("Only PDF, DOCX, and TXT files are accepted.");
      event.target.value = "";
      return;
    }

    if (file.size > maximumFileSize) {
      setFileName("");
      setErrorMessage("The file must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    setErrorMessage("");
  }

  function saveSubject(event) {
    event.preventDefault();

    if (!selectedSubject) {
      setErrorMessage("Please select a subject.");
      return;
    }

    if (!subjectMode) {
      setErrorMessage("Please select how questions will be provided.");
      return;
    }

    if (!fileName) {
      setErrorMessage("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    if (!timeAllocated || Number(timeAllocated) <= 0) {
      setErrorMessage("Please enter a valid time allocation.");
      return;
    }

    if (subjectMode === "generated") {
      if (!questionCount || Number(questionCount) <= 0) {
        setErrorMessage("Please enter the number of questions to generate.");
        return;
      }

      if (!difficulty) {
        setErrorMessage("Please select a difficulty.");
        return;
      }
    }

    const duplicateSubject = selectedSubjects.some(
      (subject) => subject.name === selectedSubject,
    );

    if (duplicateSubject) {
      setErrorMessage("This subject has already been added.");
      return;
    }

    setSelectedSubjects([
      ...selectedSubjects,
      {
        name: selectedSubject,
        mode: subjectMode,
        time: timeAllocated,
        questionCount:
          subjectMode === "generated" ? questionCount : "From file",
        difficulty:
          subjectMode === "generated" ? difficulty : "Manual tag optional",
        fileName,
        status: "Draft",
      },
    ]);

    setShowSubjectForm(false);
    setSelectedSubject("");
    setSubjectMode("");
    setTimeAllocated("");
    setQuestionCount("");
    setDifficulty("");
    setFileName("");
    setErrorMessage("");
  }

  function removeSubject(subjectName) {
    setSelectedSubjects(
      selectedSubjects.filter((subject) => subject.name !== subjectName),
    );
  }

  function handleSaveTest(event) {
    event.preventDefault();
    setSavedMessage("");

    if (!testName.trim()) {
      setErrorMessage("Please enter a name for the Test.");
      return;
    }

    if (selectedSubjects.length === 0) {
      setErrorMessage("Add at least one subject before continuing.");
      return;
    }

    if (maxTabSwitches === "" || Number(maxTabSwitches) < 0) {
      setErrorMessage("Enter a valid maximum tab-switch value.");
      return;
    }

    if (returnCountdown === "" || Number(returnCountdown) < 1) {
      setErrorMessage("Enter a return countdown of at least one second.");
      return;
    }

    setErrorMessage("");
    setSavedMessage(
      "Test settings saved locally for review. Publishing will be added next.",
    );
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
        <form onSubmit={handleSaveTest}>
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
                setErrorMessage("");
                setSavedMessage("");
              }}
              placeholder="Example: Physics Practice Set 1"
            />

            <div className="test-mode-heading">
              <p className="section-label section-label-light">TEST MODE</p>

              <p>
                This setting controls when corrections appear to the student.
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
                  <small>
                    Show the correct answer and explanation immediately.
                  </small>
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
                  <small>
                    Show corrections only after submission or time expiry.
                  </small>
                </span>
              </label>
            </div>

            <div className="tab-policy-heading">
              <p className="section-label section-label-light">
                TAB-SWITCH POLICY
              </p>

              <p>
                These settings will be copied to the Attempt when the Test
                starts.
              </p>
            </div>

            <div className="tab-policy-grid">
              <div>
                <label
                  className="create-mock-label"
                  htmlFor="max-tab-switches"
                >
                  Max Tab Switches Allowed
                </label>

                <input
                  id="max-tab-switches"
                  className="create-mock-input"
                  type="number"
                  min="0"
                  value={maxTabSwitches}
                  onChange={(event) => {
                    setMaxTabSwitches(event.target.value);
                    setErrorMessage("");
                    setSavedMessage("");
                  }}
                />
              </div>

              <div>
                <label
                  className="create-mock-label"
                  htmlFor="return-countdown"
                >
                  Return Countdown in Seconds
                </label>

                <input
                  id="return-countdown"
                  className="create-mock-input"
                  type="number"
                  min="1"
                  value={returnCountdown}
                  onChange={(event) => {
                    setReturnCountdown(event.target.value);
                    setErrorMessage("");
                    setSavedMessage("");
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
                  A Test must contain at least one subject before it can be
                  published.
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

                      <span>
                        Questions: <strong>{subject.questionCount}</strong>
                      </span>

                      <span>
                        Difficulty: <strong>{subject.difficulty}</strong>
                      </span>

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

          {errorMessage && (
            <p className="create-mock-error test-page-error" role="alert">
              {errorMessage}
            </p>
          )}

          {savedMessage && (
            <p className="login-success test-page-success" role="status">
              {savedMessage}
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
              <label className="create-mock-label" htmlFor="test-subject">
                Subject
              </label>

              <select
                id="test-subject"
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
                    name="subject-mode"
                    value="imported"
                    checked={subjectMode === "imported"}
                    onChange={(event) => {
                      setSubjectMode(event.target.value);
                      setQuestionCount("");
                      setDifficulty("");
                      setErrorMessage("");
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
                    name="subject-mode"
                    value="generated"
                    checked={subjectMode === "generated"}
                    onChange={(event) => {
                      setSubjectMode(event.target.value);
                      setErrorMessage("");
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

              <label className="create-mock-label" htmlFor="test-file">
                Upload file
              </label>

              <input
                id="test-file"
                className="create-mock-input file-input"
                type="file"
                accept={acceptedFileTypes}
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

              {subjectMode === "generated" && (
                <div className="generated-settings">
                  <label
                    className="create-mock-label"
                    htmlFor="test-question-count"
                  >
                    Number of questions
                  </label>

                  <input
                    id="test-question-count"
                    className="create-mock-input"
                    type="number"
                    min="1"
                    value={questionCount}
                    onChange={(event) => {
                      setQuestionCount(event.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Example: 30"
                  />

                  <label
                    className="create-mock-label"
                    htmlFor="test-difficulty"
                  >
                    Difficulty
                  </label>

                  <select
                    id="test-difficulty"
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

              <label className="create-mock-label" htmlFor="test-time">
                Time allocation in minutes
              </label>

              <input
                id="test-time"
                className="create-mock-input"
                type="number"
                min="1"
                value={timeAllocated}
                onChange={(event) => {
                  setTimeAllocated(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Example: 30"
              />

              {errorMessage && (
                <p className="create-mock-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="create-moda
