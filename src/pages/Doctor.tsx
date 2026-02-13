import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import type { Medication, Prescription } from "../types";
import "./Doctor.css";

/**
 * Doctor Component
 * Where doctors review nurse vitals, diagnose, and issue prescriptions.
 */
export default function Doctor() {
  const {
    patients,
    vitalsRecords,
    prescriptions,
    setPrescriptions,
    updatePatientStatus
  } = useData();

  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState<Medication[]>([{ name: "", dosage: "", frequency: "" }]);
  const [submitted, setSubmitted] = useState(false);

  // Filter: Patients ready for the doctor
  const readyPatients = patients.filter((p) => p.status === "Vitals Taken");

  // Find the nurse's report for the selected patient
  const nurseReport = vitalsRecords.find((r) => r.patientId === patientId);

  const addMedication = () => {
    setMeds([...meds, { name: "", dosage: "", frequency: "" }]);
  };

  const handleMedChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMeds = meds.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setMeds(updatedMeds);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patientId || !diagnosis) {
      alert("Please select a patient and enter a diagnosis.");
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const newPrescription: Prescription = {
      id: Date.now(),
      patientId,
      patientName: patient.name,
      diagnosis,
      medications: meds.filter((m) => m.name !== ""), // Only save filled meds
      timestamp: new Date().toLocaleString()
    };

    setPrescriptions((prev) => [newPrescription, ...prev]);
    updatePatientStatus(patientId, "Prescribed");

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Reset form
    setPatientId("");
    setDiagnosis("");
    setMeds([{ name: "", dosage: "", frequency: "" }]);
  };

  return (
    <Layout>
      <div className="doctor-container">
        <div className="doctor-header">
          <h1>👨‍⚕️ Doctor Area - Diagnosis & Prescription</h1>
          <p>Review patient vitals, diagnose, and issue prescriptions</p>
        </div>

        <div className="doctor-layout">
          {/* Consultation Form */}
          <div className="consultation-card">
            <div className="card-header">
              <h3>Patient Consultation</h3>
            </div>
            <div className="card-body">
              {submitted && (
                <div className="success-message">✓ Prescription issued successfully</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label form-label-required">Select Patient</label>
                  <select
                    className="form-select"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  >
                    <option value="">Choose patient...</option>
                    {readyPatients.length > 0 ? (
                      readyPatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No patients ready for consultation
                      </option>
                    )}
                  </select>
                  {readyPatients.length === 0 && (
                    <div className="form-text">
                      No patients with vitals recorded yet. Please ensure patients have been checked in and vitals recorded by the nurse.
                    </div>
                  )}
                </div>

                {/* Nurse's Report Display */}
                {nurseReport && (
                  <div className="vitals-report">
                    <h4>📋 Nurse's Report</h4>
                    <div className="vitals-report-grid">
                      <div className="vitals-report-item">
                        <span className="vitals-label">Temperature</span>
                        <span className="vitals-value">{nurseReport.temp}°C</span>
                      </div>
                      <div className="vitals-report-item">
                        <span className="vitals-label">Blood Pressure</span>
                        <span className="vitals-value">{nurseReport.bp}</span>
                      </div>
                      <div className="vitals-report-item">
                        <span className="vitals-label">Pulse</span>
                        <span className="vitals-value">{nurseReport.pulse} bpm</span>
                      </div>
                    </div>
                    <div style={{ background: "white", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                      <strong>Symptoms:</strong> {nurseReport.symptoms || "None reported"}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label form-label-required">Diagnosis</label>
                  <textarea
                    className="form-input"
                    placeholder="Enter your diagnosis..."
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  ></textarea>
                </div>

                <div className="medications-section">
                  <div className="medications-header">
                    <span className="medications-title">💊 Medications</span>
                    <button
                      type="button"
                      className="btn-add-medication"
                      onClick={addMedication}
                    >
                      + Add Medicine
                    </button>
                  </div>

                  <div className="medications-list">
                    {meds.map((m, index) => (
                      <div key={index} className="medication-item">
                        <div className="medication-input">
                          <label>Medicine Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Paracetamol"
                            value={m.name}
                            onChange={(e) => handleMedChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="medication-input">
                          <label>Dosage</label>
                          <input
                            type="text"
                            placeholder="e.g., 500mg"
                            value={m.dosage}
                            onChange={(e) => handleMedChange(index, "dosage", e.target.value)}
                          />
                        </div>
                        <div className="medication-input">
                          <label>Frequency</label>
                          <input
                            type="text"
                            placeholder="e.g., 3x daily"
                            value={m.frequency}
                            onChange={(e) => handleMedChange(index, "frequency", e.target.value)}
                          />
                        </div>
                        {meds.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-med"
                            onClick={() => {
                              const updatedMeds = meds.filter((_, i) => i !== index);
                              setMeds(updatedMeds);
                            }}
                            title="Remove medication"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="action-buttons">
                  <button type="submit" className="btn-submit" disabled={!patientId || !diagnosis}>
                    Issue Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Patients Ready List */}
          <div className="patients-ready-card">
            <div className="card-header">
              <h3>Ready for Consultation ({readyPatients.length})</h3>
            </div>
            <div className="patients-ready-body">
              {readyPatients.length === 0 ? (
                <div className="no-patients">
                  No patients ready for consultation
                </div>
              ) : (
                <ul className="patients-ready-list">
                  {readyPatients.map((p) => (
                    <li
                      key={p.id}
                      className={`patient-ready-item ${patientId === p.id ? "active" : ""}`}
                      onClick={() => setPatientId(p.id)}
                    >
                      <div className="patient-name">{p.name}</div>
                      <div className="patient-id">{p.id}</div>
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
