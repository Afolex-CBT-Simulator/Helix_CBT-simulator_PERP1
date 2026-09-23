"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../lib/supabase/client";
import { generateQuestions } from "../lib/local-question-engine";

const SUBJECT_CONFIG_TABLE = "subject_configs";

export default function QuestionGenerator() {
  const [mocks, setMocks] = useState([]);
  const [subjectConfigs, setSubjectConfigs] = useState([]);
  const [selectedMockId, setSelectedMockId] = useState("");
  const [selectedSubjectConfigId, setSelectedSubjectConfigId] = useState("");

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [count, setCount] = useState(5);
  const [customPrompt, setCustomPrompt] = useState("");
  const [sourceNote, setSourceNote] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedSubjectConfig = useMemo(
    () =>
      subjectConfigs.find(
        (config) => config.id === selectedSubjectConfigId,
      ),
    [subjectConfigs, selectedSubjectConfigId],
  );

  const filteredSubjectConfigs = useMemo(
    () =>
      subjectConfigs.filter(
        (config) =>
          config.parent_id === selectedMockId &&
          config.parent_type === "mock",
      ),
    [subjectConfigs, selectedMockId],
  );

  useEffect(() => {
    loadSetupData();
  }, []);

  async function loadSetupData() {
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseClient();

      const [mocksResult, subjectsResult] = await Promise.all([
        supabase
          .from("mocks")
          .select("id, name, status")
          .order("created_at", { ascending: false }),

        supabase
          .from(SUBJECT_CONFIG_TABLE)
          .select(
            "id, parent_id, parent_type, subject, mode, difficulty, time_allocated, sync_status",
          )
          .eq("parent_type", "mock")
          .order("subject", { ascending: true }),
      ]);

      if (mocksResult.error) {
        throw mocksResult.error;
      }

      if (subjectsResult.error) {
        throw subjectsResult.error;
      }

      setMocks(mocksResult.data || []);
      setSubjectConfigs(subjectsResult.data || []);
    } catch (loadError) {
      setError(
        loadError?.message ||
          "Could not load Mocks and subject configurations.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateQuestion(index, field, value) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value,
              edited: true,
              approved: question.approved,
            }
          : question,
      ),
    );
  }

  function updateOption(questionIndex, optionIndex, value) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          edited: true,
        };
      }),
    );
  }

  function toggleApproval(index) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, approved: !question.approved }
          : question,
      ),
    );
  }

  async function handleGenerate() {
    if (!selectedMockId) {
      setError("Please select a Mock.");
      return;
    }

    if (!selectedSubjectConfigId || !selectedSubjectConfig) {
      setError("Please select a configured subject.");
      return;
    }

    if (!topic.trim() || !level.trim()) {
      setError("Please enter the topic and class level.");
      return;
    }

    setGenerating(true);
    setError("");
    setSuccess("");
    setQuestions([]);

    try {
      const generated = await generateQuestions({
        subject: selectedSubjectConfig.subject,
        topic: topic.trim(),
        level: level.trim(),
        count: Math.min(Math.max(Number(count) || 5, 1), 10),
        customPrompt: customPrompt.trim(),
        sourceNote: sourceNote.trim(),
      });

      setQuestions(
        generated.map((question) => ({
          ...question,
          approved: true,
          edited: false,
        })),
      );
    } catch (generationError) {
      setError(
        generationError?.message ||
          "Question generation failed. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function saveApprovedQuestions() {
    const approvedQuestions = questions.filter((question) => question.approved);

    if (approvedQuestions.length === 0) {
      setError("Approve at least one question before saving.");
      return;
    }

    if (!selectedSubjectConfigId) {
      setError("Please select a subject configuration.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const supabase = getSupabaseClient();

      const rows = approvedQuestions.map((question) => ({
        subject_config_id: selectedSubjectConfigId,
        question_text: question.question.trim(),
        options: question.options.map((option) => option.trim()),
        correct_option: question.answer.trim(),
        explanation: question.explanation.trim(),
        origin: "local_neural_engine",
        validation_status: "pending",
        edited_flag: Boolean(question.edited),
        image_url: null,
      }));

      const { error: insertError } = await supabase
        .from("Question")
        .insert(rows);

      if (insertError) {
        throw insertError;
      }

      setQuestions([]);
      setSuccess(
        `${approvedQuestions.length} question${
          approvedQuestions.length === 1 ? "" : "s"
        } saved as pending.`,
      );
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not save the approved questions.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="question-engine-card">
        <p>Loading Mocks and subject configurations...</p>
      </section>
    );
  }

  return (
    <section className="question-engine-card">
      <div className="question-engine-header">
        <div>
          <p className="question-engine-kicker">LOCAL NEURAL ENGINE</p>

          <h2 className="question-engine-title">
            Generate draft questions
          </h2>

          <p className="question-engine-description">
            Generate, review, edit, approve, and save questions as pending.
          </p>
        </div>

        <span className="question-engine-status">Local</span>
      </div>

      <div className="question-engine-form">
        <div className="question-engine-field">
          <label htmlFor="question-mock">Mock</label>

          <select
            id="question-mock"
            value={selectedMockId}
            onChange={(event) => {
              setSelectedMockId(event.target.value);
              setSelectedSubjectConfigId("");
              setError("");
            }}
          >
            <option value="">Select a Mock</option>

            {mocks.map((mock) => (
              <option key={mock.id} value={mock.id}>
                {mock.name} ({mock.status})
              </option>
            ))}
          </select>
        </div>

        <div className="question-engine-field">
          <label htmlFor="question-subject-config">Subject</label>

          <select
            id="question-subject-config"
            value={selectedSubjectConfigId}
            onChange={(event) => {
              setSelectedSubjectConfigId(event.target.value);
              setError("");
            }}
            disabled={!selectedMockId}
          >
            <option value="">
              {selectedMockId
                ? "Select a configured subject"
                : "Select a Mock first"}
            </option>

            {filteredSubjectConfigs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.subject} — {config.mode}
              </option>
            ))}
          </select>
        </div>

        <div className="question-engine-field">
          <label htmlFor="question-topic">Topic</label>

          <input
            id="question-topic"
            type="text"
            placeholder="Photosynthesis"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
        </div>

        <div className="question-engine-field">
          <label htmlFor="question-level">Class level</label>

          <input
            id="question-level"
            type="text"
            placeholder="SS2"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          />
        </div>

        <div className="question-engine-field">
          <label htmlFor="question-count">Questions</label>

          <input
            id="question-count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(event) => {
              const nextCount = Number(event.target.value);
              setCount(Math.min(Math.max(nextCount || 1, 1), 10));
            }}
          />
        </div>
      </div>

      <div className="question-engine-field question-engine-full-field">
        <label htmlFor="question-prompt">Custom generation prompt</label>

        <textarea
          id="question-prompt"
          rows="4"
          placeholder="Optional instructions for this generation."
          value={customPrompt}
          onChange={(event) => setCustomPrompt(event.target.value)}
        />
      </div>

      <div className="question-engine-field question-engine-full-field">
        <label htmlFor="question-source-note">Source note</label>

        <textarea
          id="question-source-note"
          rows="5"
          placeholder="Optional source content for the generated questions."
          value={sourceNote}
          onChange={(event) => setSourceNote(event.target.value)}
        />
      </div>

      <button
        type="button"
        className="question-engine-button"
        onClick={handleGenerate}
        disabled={generating || saving}
      >
        {generating ? "Generating locally..." : "Generate draft questions"}
      </button>

      {error && (
        <p className="question-engine-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="candidate-upload-success" role="status">
          {success}
        </p>
      )}

      {questions.length > 0 && (
        <div className="question-engine-results">
          <div className="question-engine-results-header">
            <div>
              <p className="question-engine-kicker">REVIEW REQUIRED</p>
              <h3>Generated preview</h3>
            </div>

            <span>
              {questions.filter((question) => question.approved).length} of{" "}
              {questions.length} approved
            </span>
          </div>

          {questions.map((item, index) => (
            <article className="question-preview-card" key={index}>
              <p className="question-preview-number">
                Question {index + 1}
              </p>

              <label htmlFor={`question-text-${index}`}>
                Question text
              </label>

              <textarea
                id={`question-text-${index}`}
                rows="3"
                value={item.question}
                onChange={(event) =>
                  updateQuestion(index, "question", event.target.value)
                }
              />

              <p>Options</p>

              {item.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={option}
                  onChange={(event) =>
                    updateOption(index, optionIndex, event.target.value)
                  }
                  aria-label={`Question ${index + 1} option ${
                    optionIndex + 1
                  }`}
                />
              ))}

              <label htmlFor={`question-answer-${index}`}>
                Correct answer
              </label>

              <input
                id={`question-answer-${index}`}
                type="text"
                value={item.answer}
                onChange={(event) =>
                  updateQuestion(index, "answer", event.target.value)
                }
              />

              <label htmlFor={`question-explanation-${index}`}>
                Explanation
              </label>

              <textarea
                id={`question-explanation-${index}`}
                rows="3"
                value={item.explanation}
                onChange={(event) =>
                  updateQuestion(index, "explanation", event.target.value)
                }
              />

              <div className="question-preview-actions">
                <button
                  type="button"
                  onClick={() => toggleApproval(index)}
                >
                  {item.approved ? "Remove approval" : "Approve question"}
                </button>

                <span>
                  {item.approved ? "Will be saved" : "Will not be saved"}
                </span>
              </div>
            </article>
          ))}

          <button
            type="button"
            className="question-engine-button"
            onClick={saveApprovedQuestions}
            disabled={saving}
          >
            {saving ? "Saving approved questions..." : "Save approved questions"}
          </button>
        </div>
      )}
    </section>
  );
}
