import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";
import "./Login.css";

const roles: { value: Role; label: string; icon: string; color: string }[] = [
  { value: "admin", label: "Reception / Admin", icon: "👨‍💼", color: "#0ea5e9" },
  { value: "doctor", label: "Doctor", icon: "👨‍⚕️", color: "#06b6d4" },
  { value: "nurse", label: "Nurse", icon: "👩‍⚕️", color: "#10b981" },
  { value: "pharmacist", label: "Pharmacist", icon: "💊", color: "#14b8a6" },
  { value: "billing", label: "Billing Officer", icon: "💰", color: "#2563eb" },
];

// CUSTOMIZE: Replace with your hospital/organization banner image
const BANNER_IMAGE = "https://via.placeholder.com/600x400?text=Your+Hospital+Logo+Here";

export default function Login() {
  const [email, setEmail] = useState("admin@hospital.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState<Role | "">("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role to continue.");
      return;
    }

    setIsLoading(true);
    try {
      login(role);
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Sidebar - Banner Image & Branding */}
      <div className="login-sidebar">
        <div className="banner-container">
          <img
            src={BANNER_IMAGE}
            alt="Hospital Banner"
            className="banner-image"
          />
          <div className="banner-overlay">
            <div className="banner-content">
              <h1>Welcome</h1>
              <p>Hospital Management System</p>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure Access Control</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time Data Sync</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>24/7 System Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert-error animate-shake">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {/* Credentials Section */}
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
                  placeholder="your@email.com"
                  required
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
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-section">
              <label className="form-label">Select Your Role</label>
              <div className="role-grid">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`role-card ${role === r.value ? "active" : ""}`}
                    style={
                      role === r.value
                        ? { borderColor: r.color, backgroundColor: `${r.color}08` }
                        : {}
                    }
                    onClick={() => setRole(r.value)}
                  >
                    <span className="role-icon">{r.icon}</span>
                    <span className="role-label">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-login"
              disabled={isLoading || !role}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            {/* Footer */}
            <div className="form-footer-text">
              <p>Demo credentials: admin@hospital.com / password123</p>
            </div>
          </form>
        </div>

        {/* Bottom Footer */}
        <div className="login-footer">
          <p>© 2024 Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
