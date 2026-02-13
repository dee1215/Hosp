import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import type { Patient } from "../types";
import "./Patients.css";

/**
 * Patients Component
 * Handles patient lookup, registration, and secure check-in via OTP.
 */
export default function Patients() {
  const { patients, addPatient, updatePatientStatus } = useData();

  // Local state for modals and forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState<number | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpStep, setOtpStep] = useState<"generate" | "verify">("generate");

  // New patient state
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "Male" });

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = `PT${(patients.length + 1).toString().padStart(3, "0")}`;
    const patientToAdd: Omit<Patient, "status"> = {
      id,
      name: newPatient.name,
      age: Number.parseInt(newPatient.age, 10),
      gender: newPatient.gender
    };

    addPatient(patientToAdd);
    setShowAddModal(false);
    setSuccessMessage(
      `Patient ${patientToAdd.name} registered successfully with ID ${patientToAdd.id}`
    );
    setNewPatient({ name: "", age: "", gender: "Male" });

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const startAttendance = (patient: Patient) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(otp);
    setSelectedPatient(patient);
    setOtpStep("generate");
    setShowOtpModal(true);
  };

  const verifyAttendance = () => {
    if (!selectedPatient || generatedOtp === null) return;

    if (enteredOtp === generatedOtp.toString()) {
      updatePatientStatus(selectedPatient.id, "Waiting", generatedOtp);
      setShowOtpModal(false);
      setEnteredOtp("");
    } else {
      alert("Invalid OTP! Please try again.");
    }
  };

  return (
    <Layout>
      <div className="patients-container">
        <div className="patients-header">
          <h1>👥 Patient Management</h1>
          <p>Register, manage, and track patient check-ins</p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="patients-actions">
          <button className="btn-register" onClick={() => setShowAddModal(true)}>
            + Register New Patient
          </button>
        </div>

        <div className="patients-table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="patient-id">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>
                    <span className={`patient-status status-${p.status.toLowerCase().replace(" ", "-")}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="patient-action-btn"
                      disabled={p.status !== "Registered"}
                      onClick={() => startAttendance(p)}
                    >
                      {p.status === "Registered" ? "Start Check-in" : "Checked In"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">New Patient Registration</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label form-label-required">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label form-label-required">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      placeholder="Enter age"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label form-label-required">Gender</label>
                    <select
                      className="form-select"
                      value={newPatient.gender}
                      onChange={(e) =>
                        setNewPatient({ ...newPatient, gender: e.target.value })
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Attendance Modal */}
      {showOtpModal && selectedPatient && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Patient Check-in (OTP)</h2>
              <button className="modal-close" onClick={() => setShowOtpModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {otpStep === "generate" ? (
                <div className="otp-display">
                  <p style={{ marginBottom: "16px" }}>
                    Share this code with <strong>{selectedPatient.name}</strong>
                  </p>
                  <div className="otp-code">{generatedOtp}</div>
                  <button
                    className="btn-submit"
                    style={{ marginTop: "24px" }}
                    onClick={() => setOtpStep("verify")}
                  >
                    Proceed to Verification
                  </button>
                </div>
              ) : (
                <div className="otp-display">
                  <p style={{ marginBottom: "20px" }}>
                    Enter the OTP provided by the patient
                  </p>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    style={{
                      fontSize: "32px",
                      textAlign: "center",
                      padding: "12px",
                      border: "2px solid var(--primary)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "Monaco, monospace",
                      fontWeight: 700,
                      letterSpacing: "8px",
                      marginBottom: "24px",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  />
                  <button className="btn-submit" onClick={verifyAttendance}>
                    Confirm & Check-in
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
