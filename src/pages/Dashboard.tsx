import { useState, useMemo } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import type { Patient } from "../types";
import {
 BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { patients, vitalsRecords, prescriptions, invoices } = useData();
  const [sortField, setSortField] = useState<string>("name");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPatientForView, setSelectedPatientForView] = useState<Patient | null>(null);

  // KPI Stats - More comprehensive hospital metrics
  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      trend: "+12%",
      trendType: "positive",
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      subtext: `${patients.filter(p => p.status !== "Billed").length} active`
    },
    {
      label: "Vitals Recorded",
      value: vitalsRecords.length,
      trend: "+8%",
      trendType: "positive",
      icon: "⚕️",
      color: "from-emerald-500 to-teal-500",
      subtext: `${patients.filter(p => p.status === "Vitals Taken").length} ready for doctor`
    },
    {
      label: "Prescriptions",
      value: prescriptions.length,
      trend: "+6%",
      trendType: "positive",
      icon: "💊",
      color: "from-purple-500 to-pink-500",
      subtext: `${patients.filter(p => p.status === "Prescribed").length} awaiting pharmacy`
    },
    {
      label: "Monthly Revenue",
      value: `GHC ${(invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)).toLocaleString()}`,
      trend: "+15%",
      trendType: "positive",
      icon: "💰",
      color: "from-amber-500 to-orange-500",
      subtext: "YTD: GHC 485K"
    }
  ];

  // Chart Data: Patient Status Distribution
  const patientStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    patients.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  // Chart Data: Patient Journey Progress
  const patientJourneyData = useMemo(() => {
    return [
      { stage: "Registered", count: patients.filter(p => p.status === "Registered").length },
      { stage: "Waiting", count: patients.filter(p => p.status === "Waiting").length },
      { stage: "Vitals Taken", count: patients.filter(p => p.status === "Vitals Taken").length },
      { stage: "Prescribed", count: patients.filter(p => p.status === "Prescribed").length },
      { stage: "Medicines Dispensed", count: patients.filter(p => p.status === "Medicines Dispensed").length },
      { stage: "Billed", count: patients.filter(p => p.status === "Billed").length }
    ].filter(item => item.count > 0);
  }, [patients]);

  // Chart Data: Activity Summary
  const activityData = useMemo(() => {
    return [
      { activity: "Total Patients", count: patients.length },
      { activity: "Vitals Recorded", count: vitalsRecords.length },
      { activity: "Prescriptions", count: prescriptions.length },
      { activity: "Invoices", count: invoices.length }
    ];
  }, [patients, vitalsRecords, prescriptions, invoices]);

  // Filtered and Sorted Patients Table
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    filtered.sort((a, b) => {
      switch (sortField) {
        case "name": return a.name.localeCompare(b.name);
        case "age": return b.age - a.age;
        case "status": return a.status.localeCompare(b.status);
        default: return 0;
      }
    });
    
    return filtered.slice(0, 10);
  }, [patients, sortField, filterStatus]);

  // Calendar Events (Appointments)
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const currentDate = new Date(selectedDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
            <h1 className="dashboard-title">Dashboard 📊</h1>
            <p className="dashboard-subtitle">
              Welcome back, {getRoleDisplay()}! Here's your hospital activity overview.
            </p>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="kpi-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`kpi-card bg-gradient-${stat.color.split(' ')[1]}`}>
              <div className="kpi-header">
                <span className="kpi-icon">{stat.icon}</span>
                <span className={`kpi-trend trend-${stat.trendType}`}>{stat.trend}</span>
              </div>
              <div className="kpi-content">
                <p className="kpi-label">{stat.label}</p>
                <p className="kpi-value">{stat.value}</p>
                {stat.subtext && <p className="kpi-subtext">{stat.subtext}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Patient Journey Progress</h3>
              <span className="chart-period">Current Flow</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientJourneyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="stage" stroke="#6b7280" angle={-20} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Hospital Activity Summary</h3>
              <span className="chart-period">Real-Time Data</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="activity" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Patient Status Distribution</h3>
              <span className="chart-period">Overview</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientStatusData.map((entry, index) => {
                    const colors = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#22c55e"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="table-section">
          <div className="section-header">
            <h3>Patient Records</h3>
            <div className="table-controls">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
                <option value="status">Sort by Status</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="Registered">Registered</option>
                <option value="Waiting">Waiting</option>
                <option value="Vitals Taken">Vitals Taken</option>
                <option value="Prescribed">Prescribed</option>
                <option value="Medicines Dispensed">Medicines Dispensed</option>
                <option value="Billed">Billed</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="advanced-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="patient-cell">
                        <span className="patient-avatar">👤</span>
                        <span className="patient-name">{p.name}</span>
                      </div>
                    </td>
                    <td><span className="patient-id">{p.id}</span></td>
                    <td>
                      <span className={`status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {p.status}
                      </span>
                    </td>
                    <td><span className="age-text">{p.age} years</span></td>
                    <td><span className="gender-text">{p.gender}</span></td>
                    <td><button className="action-btn" onClick={() => setSelectedPatientForView(p)}>View →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-container">
            <div className="calendar-header">
              <h3>Appointment Calendar</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker"
              />
            </div>
            <div className="calendar-grid">
              <div className="calendar-month-year">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
              <div className="weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-dates">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="empty-date"></div>
                ))}
                {calendarDays.map(day => {
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = dateStr === selectedDate;
                  const hasEvent = Math.random() > 0.6; // Mock appointments
                  return (
                    <div
                      key={day}
                      className={`calendar-date ${isSelected ? "selected" : ""} ${hasEvent ? "has-event" : ""}`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      {day}
                      {hasEvent && <div className="event-dot"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <h3>Team Performance</h3>
            <div className="stat-item">
              <div className="stat-bar-label">
                <span>Doctor Utilization</span>
                <span className="stat-percent">78%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-bar-label">
                <span>Nurse Availability</span>
                <span className="stat-percent">92%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-bar-label">
                <span>Resource Utilization</span>
                <span className="stat-percent">65%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details Popup */}
        {selectedPatientForView && (
          <div className="popup-overlay">
            <div className="popup-card">
              <div className="popup-header">
                <h3>Patient Details</h3>
                <button className="popup-close" onClick={() => setSelectedPatientForView(null)}>✕</button>
              </div>
              <div className="popup-body">
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedPatientForView.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedPatientForView.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{selectedPatientForView.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Gender:</span>
                  <span className="detail-value">{selectedPatientForView.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${selectedPatientForView.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {selectedPatientForView.status}
                  </span>
                </div>
              </div>
              <div className="popup-footer">
                <button className="btn-popup-close" onClick={() => setSelectedPatientForView(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
