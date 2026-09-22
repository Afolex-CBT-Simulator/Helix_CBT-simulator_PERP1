"use client";

import { useState } from "react";
import { generateQuestions } from "../lib/local-question-engine";

type GeneratedQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function QuestionGenerator() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [count, setCount] = useState(5);
  const [customPrompt, setCustomPrompt] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!subject.trim() || !topic.trim() || !level.trim()) {
      setError("Please enter the subject, topic, and class level.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const result = await generateQuestions({
        subject: subject.trim(),
        topic: topic.trim(),
        level: level.trim(),
        count,
        customPrompt: customPrompt.trim(),
        sourceNote: sourceNote.trim(),
      });

      setQuestions(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Question generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
            Create questions locally, review every answer, and approve them
            before they are added to a Mock or Test.
          </p>
        </div>

        <span className="question-engine-status">
          Local
        </span>
      </div>

      <div className="question-engine-form">
        <div className="question-engine-field">
          <label htmlFor="question-subject">Subject</label>

          <input
            id="question-subject"
            type="text"
            placeholder="Biology"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
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
            min={1}
            max={10}
            value={count}
            onChange={(event) => {
              const nextCount = Number(event.target.value);
              setCount(Math.min(Math.max(nextCount, 1), 10));
            }}
          />
        </div>
      </div>

      <div className="question-engine-field question-engine-full-field">
        <label htmlFor="question-prompt">Custom generation prompt</label>

        <textarea
          id="question-prompt"
          rows={5}
          placeholder="Optional: describe how you want this generation created. Leave blank to use the default instructions."
          value={customPrompt}
          onChange={(event) => setCustomPrompt(event.target.value)}
        />

        <p className="question-engine-help">
          This applies to the current generation only. The required question
          format remains enforced.
        </p>
      </div>

      <div className="question-engine-field question-engine-full-field">
        <label htmlFor="question-source-note">Source note</label>

        <textarea
          id="question-source-note"
          rows={6}
          placeholder="Optional: paste the relevant note content here. The engine will use it for the questions and explanations."
          value={sourceNote}
          onChange={(event) => setSourceNote(event.target.value)}
        />

        <p className="question-engine-help">
          When provided, this note is treated as the primary reference.
        </p>
      </div>

      <button
        type="button"
        className="question-engine-button"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating locally..." : "Generate draft questions"}
      </button>

      {error && (
        <p className="question-engine-error" role="alert">
          {error}
        </p>
      )}

      {questions.length > 0 && (
        <div className="question-engine-results">
          <div className="question-engine-results-header">
            <div>
              <p className="question-engine-kicker">REVIEW REQUIRED</p>
              <h3>Generated preview</h3>
            </div>

            <span>{questions.length} draft questions</span>
          </div>

          {questions.map((item, index) => (
            <article className="question-preview-card" key={index}>
              <p className="question-preview-number">
                Question {index + 1}
              </p>

              <h4>{item.question}</h4>

              <ol className="question-preview-options">
                {item.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ol>

              <div className="question-preview-answer">
                <span>Correct answer</span>
                <strong>{item.answer}</strong>
              </div>

              <div className="question-preview-explanation">
                <span>Explanation</span>
                <p>{item.explanation}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
