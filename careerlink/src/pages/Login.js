import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { apiUrl } from "../api";
import "./Login.css";

export default function Login() {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const submitLogin = async () => {
    try {
      setError("");
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        data = await response.text().catch(() => null);
      }

      if (!response.ok) {
        setError(
          (data && data.message) || (typeof data === "string" && data) ||
            "Login failed. Please check your email and password.",
        );
        return;
      }

      login();
      navigate("/home");
    } catch (err) {
      console.error("Login submit error:", err);
      setError("Unable to submit login credentials. Please try again.");
    }
  };

  const submitSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      const response = await fetch(apiUrl("/api/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        data = await response.text().catch(() => null);
      }

      if (!response.ok) {
        setError(
          (data && data.message) || (typeof data === "string" && data) ||
            "Signup failed. Please try again.",
        );
        return;
      }

      setError("");
      setSuccess(
        `Welcome, ${fullName || email}! Your account was created successfully.`,
      );
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error("Signup submit error:", err);
      setError("Unable to submit signup credentials. Please try again.");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "signin") {
      await submitLogin();
      return;
    }

    await submitSignup();
  };

  return (
    <div className="login-page">
      {}
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />

      {}
      <nav className="login-nav">
        <div className="login-nav-inner">
          <div className="navbar-logo">
            <span style={{ color: "var(--accent)", fontSize: 20 }}>◈</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              CareerLink
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="#"
              style={{ color: "var(--text-secondary)", fontSize: 14 }}
            >
              Careers
            </a>
            <a
              href="#"
              style={{ color: "var(--text-secondary)", fontSize: 14 }}
            >
              Features
            </a>
            <a
              href="#"
              style={{ color: "var(--text-secondary)", fontSize: 14 }}
            >
              About
            </a>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-outline"
              style={{ fontSize: 13, padding: "7px 16px" }}
              onClick={() => {
                setTab("signin");
                setError("");
                setSuccess("");
              }}
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              style={{ fontSize: 13, padding: "7px 16px" }}
              onClick={() => {
                setTab("signup");
                setError("");
                setSuccess("");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{tab === "signin" ? "Welcome Back" : "Create Account"}</h2>
            <p>
              {tab === "signin"
                ? "Sign in to access your dream career browser."
                : "CareerLink is the premium bridge between exceptional talent and life-changing opportunities."}
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={tab === "signin" ? "tab active" : "tab"}
              onClick={() => setTab("signin")}
            >
              Sign In
            </button>
            <button
              className={tab === "signup" ? "tab active" : "tab"}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {tab === "signup" && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Work Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Password
                {tab === "signin" && (
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                )}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {tab === "signup" && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}
            <button type="submit" className="btn-primary login-submit">
              {tab === "signin" ? "Sign In to CareerLink" : "Create Account"}
            </button>
          </form>

          <p className="login-footer-text">
            {tab === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              className="link-btn"
              onClick={() => setTab(tab === "signin" ? "signup" : "signin")}
            >
              {tab === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        {}
        <div className="login-side">
          <div className="login-side-content">
            <div className="side-badge">Trusted Platform</div>
            <h3>
              Navigate Your Future
              <br />
              With Confidence
            </h3>
            <p>
              Connect with industry-leading opportunities or discover the talent
              that drives your company forward.
            </p>

            <div className="side-stats">
              <div className="stat-item">
                <span className="stat-num">500K+</span>
                <span className="stat-label">Active Jobs</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>

            <div className="side-features">
              {[
                "Precision Matching",
                "Verified Listings",
                "Instant Connect",
                "Career Insights",
              ].map((f) => (
                <div key={f} className="side-feature">
                  <span className="feature-dot">✦</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

