import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { patients, vitalsRecords, prescriptions, invoices } = useData();

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      label: "Vitals Recorded",
      value: vitalsRecords.length,
      icon: "📋",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      label: "Prescriptions",
      value: prescriptions.length,
      icon: "💊",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      label: "Total Invoices",
      value: invoices.length,
      icon: "💰",
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  const getRoleDisplay = () => {
    const roleStr = String(user?.role ?? "Guest");
    return roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {getRoleDisplay()}! 👋</h1>
            <p className="dashboard-subtitle">
              Here's a summary of your hospital activity today
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">Recent Patient Activity</h2>
            <p className="section-subtitle">Latest 5 patients</p>
          </div>

          <div className="activity-card">
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[...patients]
                    .reverse()
                    .slice(0, 5)
                    .map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="patient-name-cell">
                            <span className="patient-avatar">👤</span>
                            <span className="patient-name">{p.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="patient-id">{p.id}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-${p.status.toLowerCase()}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="details-cell">
                          {p.otp ? `OTP: ${p.otp}` : "Waiting for check-in"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
