import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

type NavLinkConfig = {
  to: string;
  label: string;
  roles: Role[];
};

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const links: NavLinkConfig[] = [
    {
      to: "/dashboard",
      label: "Dashboard",
      roles: ["admin", "nurse", "doctor", "pharmacist", "billing"]
    },
    { to: "/patients", label: "Patients", roles: ["admin", "nurse", "doctor"] },
    { to: "/nurse", label: "Nurse", roles: ["admin", "nurse"] },
    { to: "/doctor", label: "Doctor", roles: ["admin", "doctor"] },
    { to: "/pharmacy", label: "Pharmacy", roles: ["admin", "pharmacist"] },
    { to: "/billing", label: "Billing", roles: ["admin", "billing"] }
  ];

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg">
      <div className="container-fluid">
        <h3 className="navbar-brand">Hospital System</h3>

        <div className="navbar-nav">
          {links.map(
            (link) =>
              role &&
              link.roles.includes(role) && (
                <Link key={link.to} className="nav-link" to={link.to}>
                  {link.label}
                </Link>
              )
          )}
        </div>
      </div>
    </aside>
  );
}
