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

export default function StudentEntryPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedName = fullName.trim();
    const normalizedCandidateId = normalizeCandidateId(candidateId);

    if (!cleanedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!normalizedCandidateId) {
      setErrorMessage("Please enter your Candidate ID.");
      return;
    }

    const matchedCandidate = temporaryCandidates.find(
      (candidate) =>
        normalizeCandidateId(candidate.candidateId) === normalizedCandidateId,
    );

    if (!matchedCandidate) {
      setErrorMessage(
        "We couldn't find this Candidate ID on our records. Please contact your instructor to be registered.",
      );
      return;
    }

    const candidateDetails = {
      id: normalizedCandidateId,
      fullName: matchedCandidate.fullName,
      candidateId: normalizedCandidateId,
    };

    window.sessionStorage.setItem(
      "helix_candidate_details",
      JSON.stringify(candidateDetails),
    );

    setErrorMessage("");
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
          Enter your registered name and Candidate ID to continue.
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
            placeholder="Example: HOT-2027-001"
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
