"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (passcode.trim() === "") {
      setErrorMessage("Please enter the admin passcode.");
      return;
    }

    if (passcode !== "Helix Simulator") {
      setErrorMessage("Incorrect admin passcode. Please try again.");
      return;
    }

    setErrorMessage("");
    alert("Admin passcode accepted. The dashboard will be added next.");
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

        <form className="login-form" onSubmit={handleSubmit}>
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
            />

            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              title={showPasscode ? "Hide passcode" : "Show passcode"}
            >
              {showPasscode ? "◉" : "◌"}
            </button>
          </div>

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
            }        </div>
      )}
    </main>
  );
            }
