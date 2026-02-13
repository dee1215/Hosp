import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import type { User } from "../types";
import "./Login.css";
import logoImage from "../assests/sidrid-logo.png";
import heroImage from "../assests/HMS.jpg";

// Predefined user accounts with their roles
const DEMO_USERS: User[] = [
  { id: "1", email: "admin@hospital.com", name: "Reception Admin", role: "admin" },
  { id: "2", email: "doctor@hospital.com", name: "Dr. Smith", role: "doctor" },
  { id: "3", email: "nurse@hospital.com", name: "Nurse Jane", role: "nurse" },
  { id: "4", email: "pharmacist@hospital.com", name: "Pharmacist John", role: "pharmacist" },
  { id: "5", email: "billing@hospital.com", name: "Billing Officer", role: "billing" },
];

// Main hero image for the left side
const HERO_IMAGE = heroImage;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { staff } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // 1. Try to authenticate against staff accounts created by admin
      const staffMember = staff.find(
        (m) =>
          m.email.toLowerCase() === email.toLowerCase() && m.password === password
      );

      if (staffMember) {
        const userFromStaff: User = {
          id: staffMember.id,
          email: staffMember.email,
          name: staffMember.name,
          role: staffMember.role
        };
        login(userFromStaff);
        navigate("/dashboard");
        setIsLoading(false);
        return;
      }

      // 2. Fallback to demo users (use password "password")
      const demoUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && password === "password"
      );

      if (demoUser) {
        login(demoUser);
        navigate("/dashboard");
      } else {
        setError(
          "Invalid email or password. Use your staff account created by the admin or one of the demo accounts below."
        );
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      {/* Top Navbar */}
      <header className="login-navbar">
        <div className="login-navbar-inner">
          <div className="login-navbar-logo-mark">
            <img src={logoImage} alt="Sidrid logo" className="login-logo-img" />
          </div>
        </div>
      </header>

      {/* Split Body */}
      <div className="login-body">
        {/* Left Side - Image + Welcome Brand */}
        <section className="login-left">
          <div className="login-left-image-wrapper">
            <img
              src={HERO_IMAGE}
              alt="Modern hospital corridor"
              className="login-left-image"
            />
          </div>

          <div className="login-left-brand">
            <div className="login-left-logo">
              <span className="login-left-logo-mark">
                <img src={logoImage} alt="Sidrid logo" className="login-logo-img" />
              </span>
            </div>
            <div className="login-left-text">
              <p className="login-left-welcome">Welcome to</p>
              <h1 className="login-left-title">
                Sidrid Hospital
                <span className="login-left-title-accent"> Management System</span>
              </h1>
              <p className="login-left-description">
                A centralized platform to manage patients, doctors, nurses, pharmacy,
                and billing with ease and security.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side - Login Form */}
        <section className="login-right">
          <div className="login-card">
            <div className="form-header">
              <h2>Login to Continue</h2>
              <p>Please enter your credentials to access the dashboard.</p>
            </div>

            {error && (
              <div className="alert-error animate-shake">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hospital.com"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-login"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>
          </div>

          <div className="login-footer">
            <p>© 2024 Sidrid Hospital Management System. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
