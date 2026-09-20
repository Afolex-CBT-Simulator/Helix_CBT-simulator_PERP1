export default function AdminLoginPage() {
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

        <form className="login-form">
          <label htmlFor="admin-passcode">Admin passcode</label>

          <input
            id="admin-passcode"
            name="admin-passcode"
            type="password"
            placeholder="Enter passcode"
          />

          <button type="submit" className="login-button">
            Continue
          </button>
        </form>

        <a href="/" className="back-link">
          ← Back to home
        </a>
      </section>
    </main>
  );
    }
