import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="modern-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h4 className="navbar-title">Hospital Management System</h4>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div className="user-details">
              <p className="user-name">{user?.role || "User"}</p>
              <p className="user-role">Logged in</p>
            </div>
          </div>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
