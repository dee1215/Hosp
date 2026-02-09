import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Login Component
 * This is where users enter their credentials and select their role.
 */
function Login() {
  // Local state for the form
  const [email, setEmail] = useState("admin@hospital.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    if (!role) {
      setError("Please select a role to continue.");
      return;
    }

    // Call the global login function
    login(role);
    
    // Go to the dashboard
    navigate("/dashboard");
  };

  return (
    <div className="page page-center bg-light">
      <div className="container-tight py-4">
        <div className="text-center mb-4">
          <h1 className="text-primary">🏥 Hospital System</h1>
        </div>

        <div className="card card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login to your account</h2>
            
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Select Your Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Choose your role...</option>
                  <option value="admin">Reception / Admin</option>
                  <option value="nurse">Nurse</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary w-100">
                  Sign in to Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center text-muted mt-3">
          <small>Demo: Use any email/password and select a role.</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
