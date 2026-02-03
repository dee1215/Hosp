import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!role) return;
    login(role);
    navigate("/dashboard");
  };

  return (
    <div className="container container-tight py-4">
      <h2>Login</h2>

      <select
        className="form-select my-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select role</option>
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
        <option value="pharmacist">Pharmacist</option>
        <option value="billing">Billing</option>
      </select>

      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
