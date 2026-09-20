"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const temporaryCandidates = [
  {
    fullName: "Sample Candidate",
    candidateId: "HOT2027001",
  },
];

function normalizeCandidateId(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeFullName(value) {
  return value.trim().replace(/s+/g, " ").toLowerCase();
}

export default function StudentEntryPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = normalizeFullName(fullName);
    const normalizedCandidateId = normalizeCandidateId(candidateId);

    setErrorMessage("");

    if (!cleanedName) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }

    if (!normalizedCandidateId) {
      setErrorMessage("Please enter your Candidate ID.");
      return;
    }

    const matchedCandidate = temporaryCandidates.find(
      (candidate) =>
        normalizeCandidateId(candidate.candidateId) ===
        normalizedCandidateId,
    );

    if (!matchedCandidate) {
      setErrorMessage(
        "We couldn't find this Candidate ID on our records. Please contact your instructor to be registered.",
      );
      return;
    }

    const enteredNameMatches =
      normalizeFullName(matchedCandidate.fullName) === cleanedName;

    if (!enteredNameMatches) {
      setErrorMessage(
        "The Full Name does not match this Candidate ID. Please check your details and try again.",
      );
      return;
    }

    const candidateSession = {
      fullName: matchedCandidate.fullName,
      candidateId: normalizeCandidateId(matchedCandidate.candidateId),
    };

    window.sessionStorage.setItem(
      "helix_candidate_session",
      JSON.stringify(candidateSession),
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

        <h1>Candidate Login</h1>

        <p className="login-description">
          Enter your registered details to access the Student Dashboard.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="full-name">Full Name</label>

          <input
            id="full-name"
            name="full-name"
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Enter your full name"
            autoComplete="name"
          />

          <label className="student-field-label" htmlFor="candidate-id">
            Candidate ID
          </label>

          <input
            id="candidate-id"
            name="candidate-id"
            type="text"
            value={candidateId}
            onChange={(event) => {
              setCandidateId(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Example: HOT2027001"
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

        <p className="candidate-help-text">
          If you are not registered, please contact your instructor.
        </p>

        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </section>
    </main>
  );
              }
