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

const OPTION_KEYS = ["A", "B", "C", "D"];

export default function MockDetailPage() {
  const params = useParams();
  const mockId = params?.id;

  const [mock, setMock] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectMode, setSubjectMode] = useState("imported");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
  });
  const [correctOption, setCorrectOption] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingSubject, setSavingSubject] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [updatingSubjectId, setUpdatingSubjectId] = useState(null);
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

        if (subjectData?.length > 0) {
          setSelectedSubjectId(subjectData[0].id);
        }
      } catch (error) {
        setErrorMessage(error.message || "Could not load this Mock.");
      } finally {
        setLoading(false);
      }
    }

    loadMockAndSubjects();
  }, [mockId]);

  useEffect(() => {
    async function loadQuestions() {
      if (!selectedSubjectId) {
        setQuestions([]);
        return;
      }

      try {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
          .from("questions")
          .select(
            "id, subject_config_id, question_text, options, correct_option, explanation, origin, validation_status, edited_flag, created_at",
          )
          .eq("subject_config_id", selectedSubjectId)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        setQuestions(data || []);
      } catch (error) {
        setErrorMessage(error.message || "Could not load questions.");
      }
    }

    loadQuestions();
  }, [selectedSubjectId]);

  async function addSubject(event) {
    event.preventDefault();

    const cleanedSubjectName = subjectName.trim().replace(/\s+/g, " ");

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
      setSelectedSubjectId(data.id);
      setSubjectName("");
      setSubjectMode("imported");
      setSuccessMessage("Subject added as Draft.");
    } catch (error) {
      setErrorMessage(error.message || "Could not add this subject.");
    } finally {
      setSavingSubject(false);
    }
  }

  async function toggleSubjectSync(subjectConfig) {
    const nextStatus =
      subjectConfig.sync_status === "synced" ? "draft" : "synced";

    setUpdatingSubjectId(subjectConfig.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("subject_configs")
        .update({
          sync_status: nextStatus,
        })
        .eq("id", subjectConfig.id)
        .eq("parent_id", mockId)
        .eq("parent_type", "mock")
        .select(
          "id, parent_id, parent_type, subject, mode, difficulty, time_allocated, sync_status, source_file_name, created_at",
        )
        .single();

      if (error) {
        throw error;
      }

      setSubjects((currentSubjects) =>
        currentSubjects.map((subject) =>
          subject.id === data.id ? data : subject,
        ),
      );

      setSuccessMessage(
        nextStatus === "synced"
          ? `${subjectConfig.subject} marked as Synced.`
          : `${subjectConfig.subject} returned to Draft.`,
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not update subject status.");
    } finally {
      setUpdatingSubjectId(null);
    }
  }

  function updateOption(optionKey, value) {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [optionKey]: value,
    }));
  }

  function clearQuestionForm() {
    setQuestionText("");
    setOptions({
      A: "",
      B: "",
      C: "",
      D: "",
    });
    setCorrectOption("A");
    setExplanation("");
  }

  async function addQuestion(event) {
    event.preventDefault();

    if (!selectedSubjectId) {
      setErrorMessage("Add or select a subject before adding a question.");
      setSuccessMessage("");
      return;
    }

    if (!questionText.trim()) {
      setErrorMessage("Please enter the question text.");
      setSuccessMessage("");
      return;
    }

    const cleanedOptions = Object.fromEntries(
      OPTION_KEYS.map((optionKey) => [
        optionKey,
        options[optionKey].trim(),
      ]),
    );

    const missingOption = OPTION_KEYS.find(
      (optionKey) => !cleanedOptions[optionKey],
    );

    if (missingOption) {
      setErrorMessage(`Please enter option ${missingOption}.`);
      setSuccessMessage("");
      return;
    }

    if (!explanation.trim()) {
      setErrorMessage("Please enter an explanation.");
      setSuccessMessage("");
      return;
    }

    setSavingQuestion(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("questions")
        .insert({
          subject_config_id: selectedSubjectId,
          question_text: questionText.trim(),
          options: cleanedOptions,
          correct_option: correctOption,
          explanation: explanation.trim(),
          origin: "ai-generated",
          validation_status: "pending",
          edited_flag: false,
        })
        .select(
          "id, subject_config_id, question_text, options, correct_option, explanation, origin, validation_status, edited_flag, created_at",
        )
        .single();

      if (error) {
        throw error;
      }

      setQuestions((currentQuestions) => [...currentQuestions, data]);
      clearQuestionForm();
      setSuccessMessage("Question saved as Pending.");
    } catch (error) {
      setErrorMessage(error.message || "Could not save the question.");
    } finally {
      setSavingQuestion(false);
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
            Configure subjects and questions for this Mock.
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
              This page belongs only to this Mock. Subjects and questions added
              here will not appear under another Mock.
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

                  <div className="subject-list-actions">
                    <span className="mock-status-badge">
                      {subjectConfig.sync_status}
                    </span>

                    <button
                      className="subject-sync-button"
                      type="button"
                      onClick={() => toggleSubjectSync(subjectConfig)}
                      disabled={updatingSubjectId === subjectConfig.id}
                    >
                      {updatingSubjectId === subjectConfig.id
                        ? "Updating..."
                        : subjectConfig.sync_status === "synced"
                          ? "Return to Draft"
                          : "Mark as Synced"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="dashboard-list-section">
          <div className="dashboard-list-heading">
            <div>
              <p className="section-label section-label-light">
                QUESTION ENTRY
              </p>

              <h2>Add a question</h2>
            </div>

            <span className="dashboard-count-badge">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </span>
          </div>

          {subjects.length === 0 ? (
            <div className="dashboard-empty-state">
              <p>Add a subject before adding questions.</p>
            </div>
          ) : (
            <div className="create-mock-form-card">
              <form onSubmit={addQuestion}>
                <label
                  className="create-mock-label"
                  htmlFor="question-subject"
                >
                  Subject
                </label>

                <select
                  id="question-subject"
                  className="create-mock-input"
                  value={selectedSubjectId}
                  onChange={(event) => {
                    setSelectedSubjectId(event.target.value);
                    setErrorMessage("");
                  }}
                  disabled={savingQuestion}
                >
                  {subjects.map((subjectConfig) => (
                    <option
                      value={subjectConfig.id}
                      key={subjectConfig.id}
                    >
                      {subjectConfig.subject}
                    </option>
                  ))}
                </select>

                <label
                  className="create-mock-label"
                  htmlFor="question-text"
                >
                  Question text
                </label>

                <textarea
                  id="question-text"
                  className="create-mock-input question-textarea"
                  value={questionText}
                  onChange={(event) => {
                    setQuestionText(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Example: What is the chemical formula for water, H₂O?"
                  rows={5}
                  disabled={savingQuestion}
                />

                <p className="question-format-help">
                  Scientific characters such as H₂O, x², α, β, Δ, √, and ∫
                  are supported as normal text.
                </p>

                <div className="question-options-grid">
                  {OPTION_KEYS.map((optionKey) => (
                    <div key={optionKey}>
                      <label
                        className="create-mock-label"
                        htmlFor={`question-option-${optionKey}`}
                      >
                        Option {optionKey}
                      </label>

                      <textarea
                        id={`question-option-${optionKey}`}
                        className="create-mock-input question-option-input"
                        value={options[optionKey]}
                        onChange={(event) =>
                          updateOption(optionKey, event.target.value)
                        }
                        rows={3}
                        disabled={savingQuestion}
                      />
                    </div>
                  ))}
                </div>

                <fieldset className="correct-option-fieldset">
                  <legend className="create-mock-label">
                    Correct option
                  </legend>

                  <div className="correct-option-list">
                    {OPTION_KEYS.map((optionKey) => (
                      <label key={optionKey}>
                        <input
                          type="radio"
                          name="correct-option"
                          value={optionKey}
                          checked={correctOption === optionKey}
                          onChange={(event) =>
                            setCorrectOption(event.target.value)
                          }
                          disabled={savingQuestion}
                        />
                        <span>{optionKey}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label
                  className="create-mock-label"
                  htmlFor="question-explanation"
                >
                  Explanation
                </label>

                <textarea
                  id="question-explanation"
                   className="create-mock-input question-textarea"
              value={explanation}
              onChange={(event) => {
                setExplanation(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Explain why the selected option is correct."
              rows={4}
              disabled={savingQuestion}
            />

            <div className="create-modal-actions">
              <button
                className="create-submit-button"
                type="submit"
                disabled={savingQuestion}
              >
                {savingQuestion ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      )}

      {questions.length > 0 && (
        <div className="question-list">
          {questions.map((question, index) => (
            <article className="question-list-item" key={question.id}>
              <div>
                <p className="question-number">
                  Question {index + 1}
                </p>

                <h3>{question.question_text}</h3>

                <ul className="question-option-list">
                  {OPTION_KEYS.map((optionKey) => (
                    <li key={optionKey}>
                      <span>{optionKey}. </span>
                      {question.options?.[optionKey]}
                      {question.correct_option === optionKey && (
                        <strong> - Correct</strong>
                      )}
                    </li>
                  ))}
                </ul>

                <p className="question-explanation">
                  {question.explanation}
                </p>
              </div>

              <span className="mock-status-badge">
                {question.validation_status}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  </section>
</main>
);
}
