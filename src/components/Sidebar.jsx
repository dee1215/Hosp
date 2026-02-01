import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="navbar navbar-vertical navbar-expand-lg">
      <div className="container-fluid">
        <h3 className="navbar-brand">Hospital System</h3>

        <div className="navbar-nav">
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/patients">Patients</Link>
          <Link className="nav-link" to="/nurse">Nurse</Link>
          <Link className="nav-link" to="/doctor">Doctor</Link>
          <Link className="nav-link" to="/pharmacy">Pharmacy</Link>
          <Link className="nav-link" to="/billing">Billing</Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
