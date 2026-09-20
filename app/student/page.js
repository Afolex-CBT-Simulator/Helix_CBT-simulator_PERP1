"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudentEntryPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = studentName.trim();
    const cleanedExamNumber = examNumber.trim();

    if (!cleanedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!cleanedExamNumber) {
      setErrorMessage("Please enter your exam number.");
      return;
    }

    window.sessionStorage.setItem(
      "helix_student_details",
      JSON.stringify({
        name: cleanedName,
        examNumber: cleanedExamNumber,
      }),
    );

    router.push("/student/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-card student-entry-card">
        <div className="login-brand-mark">
          <span>H</span>
        </div>

        <p className="login-kicker">HELIX ACADEMY</p>

        <h1>Student Entry</h1>

        <p className="login-description">
          Enter your details before selecting a Mock or Test.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="student-name">Full name</label>

          <input
            id="student-name"
            name="student-name"
            type="text"
            value={studentName}
            onChange={(event) => {
              setStudentName(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter your full name"
            autoComplete="name"
          />

          <label className="student-field-label" htmlFor="exam-number">
            Exam number
          </label>

          <input
            id="exam-number"
            name="exam-number"
            type="text"
            value={examNumber}
            onChange={(event) => {
              setExamNumber(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter your exam number"
            autoComplete="off"
          />

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="login-button">
            Continue
          </button>
        </form>

        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </section>
    </main>
  );
                                               }
