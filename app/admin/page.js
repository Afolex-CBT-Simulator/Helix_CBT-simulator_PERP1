"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const enteredPasscode = passcode.trim();

    if (!enteredPasscode) {
      setErrorMessage("Please enter the admin passcode.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          passcode: enteredPasscode,
        }),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }

      window.location.href = "/admin/dashboard";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
              onChange={(event) => {
                setPasscode(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter passcode"
              autoComplete="current-password"
              aria-invalid={errorMessage ? "true" : "false"}
              disabled={loading}
            />

            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPasscode((current) => !current)}
              aria-label={
                showPasscode ? "Hide admin passcode" : "Show admin passcode"
              }
              title={showPasscode ? "Hide passcode" : "Show passcode"}
              disabled={loading}
            >
              <span
                className={`eye-icon ${
                  showPasscode ? "" : "is-hidden"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
