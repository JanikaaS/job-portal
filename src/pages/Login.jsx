import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/jobs");
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response) {
        setMessage("Login failed. Please check your email and password.");
      } else {
        setMessage(
          "Cannot connect to the backend. Make sure the server is running on port 5000."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="visual-content">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Make your next move count.</h1>
          <p>
            Sign in to explore new opportunities, keep track of applications,
            and move your career forward.
          </p>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <Link to="/jobs" className="brand auth-brand">
            Career<span>Connect</span>
          </Link>

          <p className="form-label">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="muted">Pick up where your career search left off.</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button
              className="primary-btn full-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message && (
            <p className="error-message" role="status">
              {message}
            </p>
          )}

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
