"use client";

import { useState } from "react";
import { generateQuestions } from "@/lib/local-question-engine";

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
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!subject || !topic || !level) {
      setError("Please enter the subject, topic, and class level.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const result = await generateQuestions({
        subject,
        topic,
        level,
        count
      });

      setQuestions(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Question generation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Generate questions</h2>
        <p className="text-sm text-gray-600">
          Generate draft questions for review. Nothing is published automatically.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-md border p-3"
          placeholder="Subject, e.g. Biology"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />

        <input
          className="rounded-md border p-3"
          placeholder="Topic, e.g. Photosynthesis"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />

        <input
          className="rounded-md border p-3"
          placeholder="Class level, e.g. SS2"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        />

        <input
          className="rounded-md border p-3"
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-md bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate draft questions"}
      </button>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Preview</h3>

          {questions.map((item, index) => (
            <article key={index} className="rounded-lg border p-4">
              <p className="font-medium">
                {index + 1}. {item.question}
              </p>

              <ul className="mt-3 list-disc space-y-1 pl-5">
                {item.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>

              <p className="mt-3 text-sm">
                <span className="font-semibold">Answer:</span> {item.answer}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Explanation:</span>{" "}
                {item.explanation}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
