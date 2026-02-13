import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

/**
 * Dashboard Component
 * Shows a high-level overview of the hospital's activity.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { patients, vitalsRecords, prescriptions, invoices } = useData();

  // Calculate dynamic stats
  const stats = [
    { label: "Total Patients", value: patients.length, color: "blue", icon: "👥" },
    {
      label: "Vitals Recorded",
      value: vitalsRecords.length,
      color: "green",
      icon: "📋"
    },
    { label: "Prescriptions", value: prescriptions.length, color: "purple", icon: "💊" },
    { label: "Billed", value: invoices.length, color: "yellow", icon: "💰" }
  ];

  const getRoleDisplay = () => {
    const roleStr = String(user?.role ?? "Guest");
    return roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
  };

  return (
    <Layout>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Welcome back, {getRoleDisplay()}!</h2>
              <div className="text-muted small mt-1">
                Here is what&apos;s happening in your hospital today.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {stats.map((stat, index) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className="card shadow-sm card-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span className={`bg-${stat.color} text-white avatar shadow-sm`}>
                          {stat.icon}
                        </span>
                      </div>
                      <div className="col">
                        <div className="font-weight-medium">{stat.value}</div>
                        <div className="text-muted">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-12 mt-4">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Recent Patient Activity</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
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
                              <div>{p.name}</div>
                              <div className="text-muted small">ID: {p.id}</div>
                            </td>
                            <td>
                              <span
                                className={`badge bg-${
                                  p.status === "Billed" ? "success" : "primary"
                                }-lt`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="text-muted small">
                              {p.otp
                                ? `Checked in with OTP: ${p.otp}`
                                : "Waiting for check-in"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
