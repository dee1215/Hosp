import { useAuth } from "../context/AuthContext";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="modern-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="btn-menu" onClick={onMenuClick} aria-label="Toggle menu">
            ☰
          </button>
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
