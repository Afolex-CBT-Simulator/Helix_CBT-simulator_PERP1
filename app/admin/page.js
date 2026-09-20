"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");

    if (passcode.trim() === "") {
      setErrorMessage("Please enter the admin passcode.");
      return;
    }

    if (passcode !== "Helix Simulator") {
      setErrorMessage("Incorrect passcode. Please try again.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("Passcode accepted. Admin access confirmed.");
  }

  function handlePasscodeChange(event) {
    setPasscode(event.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand-mark">
          <span>H</span>
        </div>

        <p className="login-kicker">HELIX ACADEMY</p>

        <h1>Admin Login</h1>

        <p className="login-description">
          Enter the administrator passcode to manage mock examinations.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="admin-passcode">Admin passcode</label>

          <div className="password-field">
            <input
              id="admin-passcode"
              name="admin-passcode"
              type={showPasscode ? "text" : "password"}
              value={passcode}
              onChange={handlePasscodeChange}
              placeholder="Enter passcode"
              autoComplete="current-password"
              aria-invalid={errorMessage ? "true" : "false"}
            />

            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPasscode((current) => !current)}
              aria-label={
                showPasscode ? "Hide admin passcode" : "Show admin passcode"
              }
              title={showPasscode ? "Hide passcode" : "Show passcode"}
            >
              {showPasscode ? "🙈" : "👁"}
            </button>
          </div>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="login-success" role="status">
              {successMessage}
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
