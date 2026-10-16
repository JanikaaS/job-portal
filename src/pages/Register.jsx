import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("[REGISTER] Create Account clicked");
    console.log("[REGISTER] Submitting registration request");

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[REGISTER] Failed:", data.message);
        throw new Error(data.message || "Registration failed");
      }

      console.log("[REGISTER] Account created successfully", {
        username: data.user.username,
        email: data.user.email,
      });

      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("[REGISTER] Error:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="visual-content">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Find work that moves you forward.</h1>
          <p>
            Discover opportunities, connect with employers, and build your
            career with CareerConnect.
          </p>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <Link to="/" className="brand auth-brand">
            Career<span>Connect</span>
          </Link>

          <p className="form-label">GET STARTED FOR FREE</p>
          <h2>Create your account</h2>
          <p className="muted">
            Start exploring career opportunities today.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Full name</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />

            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete="new-password"
              required
            />

            <button className="primary-btn full-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <p className="status-message" role="status">
              {message}
            </p>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}