import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import type { VitalsForm, VitalsRecord } from "../types";
import "./Nurse.css";

/**
 * Nurse Component
 * Where nurses record vital signs and symptoms for patients who have checked in.
 */
export default function Nurse() {
  const { patients, addVitals } = useData();

  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [vitals, setVitals] = useState<VitalsForm>({
    temp: "",
    bp: "",
    pulse: "",
    symptoms: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Filter: Only patients waiting after OTP check-in
  const waitingPatients = patients.filter((p) => p.status === "Waiting");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patientId) {
      alert("Please select a patient first.");
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Create the record
    const record: VitalsRecord = {
      id: Date.now(),
      patientId,
      patientName: patient.name,
      ...vitals,
      timestamp: new Date().toLocaleString()
    };

    // Save to global context
    addVitals(record);

    // Feedback to user
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Reset form
    setPatientId("");
    setVitals({ temp: "", bp: "", pulse: "", symptoms: "" });
  };

  return (
    <Layout>
      <div className="nurse-container">
        <div className="nurse-header">
          <h1>⚕️ Nurse Area - Vital Signs</h1>
          <p>Record patient vital signs and observations</p>
        </div>

        <div className="nurse-layout">
          {/* Vitals Recording Form */}
          <div className="nurse-form-card">
            <div className="form-header">
              <h3>Record Patient Vitals</h3>
            </div>
            <div className="form-body">
              {submitted && (
                <div className="success-alert">✓ Vitals recorded successfully</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label form-label-required">
                    Select Patient (Waiting List)
                  </label>
                  <select
                    className="form-select"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  >
                    <option value="">Choose patient...</option>
                    {waitingPatients.length > 0 ? (
                      waitingPatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No patients waiting
                      </option>
                    )}
                  </select>
                  {waitingPatients.length === 0 && (
                    <div className="form-text">
                      No patients are currently waiting. Please ensure patients have been checked in via OTP.
                    </div>
                  )}
                </div>

                <div className="vitals-grid">
                  <div className="vitals-input-group">
                    <label>Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                    />
                  </div>
                  <div className="vitals-input-group">
                    <label>Blood Pressure</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    />
                  </div>
                  <div className="vitals-input-group">
                    <label>Pulse (bpm)</label>
                    <input
                      type="number"
                      placeholder="72"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms & Observations</label>
                  <textarea
                    placeholder="Describe how the patient feels..."
                    value={vitals.symptoms}
                    onChange={(e) => setVitals({ ...vitals, symptoms: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Save Vitals & Forward to Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Waiting Patients List */}
          <div className="patients-list-card">
            <div className="form-header">
              <h3>Waiting Patients ({waitingPatients.length})</h3>
            </div>
            <div className="patients-list-body">
              {waitingPatients.length === 0 ? (
                <div className="no-patients-message">
                  No patients waiting for vital signs
                </div>
              ) : (
                <ul className="patients-list">
                  {waitingPatients.map((p) => (
                    <li
                      key={p.id}
                      className={`patient-item ${patientId === p.id ? "active" : ""}`}
                      onClick={() => setPatientId(p.id)}
                    >
                      <div className="patient-name">{p.name}</div>
                      <div className="patient-id">{p.id}</div>
                      <span className="patient-status">Waiting</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
