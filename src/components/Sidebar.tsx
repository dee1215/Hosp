import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";
import logoImage from "../assests/sidrid-logo.png";

type NavLinkConfig = {
  to: string;
  label: string;
  icon: string;
  roles: Role[];
};

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const location = useLocation();

  const links: NavLinkConfig[] = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      roles: ["admin", "nurse", "doctor", "pharmacist", "billing"]
    },
    {
      to: "/patients",
      label: "Patients",
      icon: "👥",
      roles: ["admin", "nurse", "doctor"]
    },
    {
      to: "/nurse",
      label: "Nursing",
      icon: "👩‍⚕️",
      roles: ["admin", "nurse"]
    },
    {
      to: "/doctor",
      label: "Medical",
      icon: "👨‍⚕️",
      roles: ["admin", "doctor"]
    },
    {
      to: "/pharmacy",
      label: "Pharmacy",
      icon: "💊",
      roles: ["admin", "pharmacist"]
    },
    {
      to: "/billing",
      label: "Billing",
      icon: "💰",
      roles: ["admin", "billing"]
    },
    {
      to: "/staff",
      label: "Staff",
      icon: "🧑‍⚕️",
      roles: ["admin"]
    }
  ];

  return (
    <aside className="modern-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logoImage} alt="Sidrid logo" className="sidebar-logo-img" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(
          (link) =>
            role &&
            link.roles.includes(role) && (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            )
        )}
      </nav>
    </aside>
  );
}
