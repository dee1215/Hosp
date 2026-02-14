import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import type { VitalsForm, VitalsRecord } from "../types";
import "./Nurse.css";

/**
 * Nurse Component
 * Where nurses record vital signs and symptoms for patients who have checked in.
 */
export default function Nurse() {
  const { patients, vitalsRecords, addVitals } = useData();
  const { addToast } = useToast();

  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [vitals, setVitals] = useState<VitalsForm>({
    temp: "",
    bp: "",
    pulse: "",
    symptoms: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter: Only patients waiting after OTP check-in
  const waitingPatients = patients.filter((p) => p.status === "Waiting");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!patientId) {
      newErrors.patientId = "Please select a patient.";
    }

    if (!vitals.temp) {
      newErrors.temp = "Temperature is required.";
    } else if (isNaN(Number(vitals.temp)) || Number(vitals.temp) < 35 || Number(vitals.temp) > 42) {
      newErrors.temp = "Temperature must be between 35–42°C.";
    }

    if (!vitals.bp) {
      newErrors.bp = "Blood pressure is required.";
    } else if (!/^\d+\/\d+$/.test(vitals.bp)) {
      newErrors.bp = "Blood pressure format should be: 120/80";
    }

    if (!vitals.pulse) {
      newErrors.pulse = "Pulse is required.";
    } else if (isNaN(Number(vitals.pulse)) || Number(vitals.pulse) < 40 || Number(vitals.pulse) > 200) {
      newErrors.pulse = "Pulse must be between 40–200 bpm.";
    }

    if (!vitals.symptoms.trim()) {
      newErrors.symptoms = "Please describe symptoms or observations.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
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

    // Show success toast
    addToast("Vitals recorded successfully", "success");

    // Reset form
    setPatientId("");
    setVitals({ temp: "", bp: "", pulse: "", symptoms: "" });
    setErrors({});
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
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label form-label-required">
                    Select Patient (Waiting List)
                  </label>
                  <select
                    className={`form-select ${errors.patientId ? "input-error" : ""}`}
                    value={patientId}
                    onChange={(e) => {
                      setPatientId(e.target.value);
                      if (errors.patientId) setErrors({ ...errors, patientId: "" });
                    }}
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
                  {errors.patientId && <div className="form-error">{errors.patientId}</div>}
                  {waitingPatients.length === 0 && (
                    <div className="form-text">
                      No patients are currently waiting. Please ensure patients have been checked in via OTP.
                    </div>
                  )}
                </div>

                <div className="vitals-grid">
                  <div className="vitals-input-group">
                    <label>Temperature (°C) *</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      className={errors.temp ? "input-error" : ""}
                      value={vitals.temp}
                      onChange={(e) => {
                        setVitals({ ...vitals, temp: e.target.value });
                        if (errors.temp) setErrors({ ...errors, temp: "" });
                      }}
                    />
                    {errors.temp && <div className="field-error">{errors.temp}</div>}
                  </div>
                  <div className="vitals-input-group">
                    <label>Blood Pressure *</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      className={errors.bp ? "input-error" : ""}
                      value={vitals.bp}
                      onChange={(e) => {
                        setVitals({ ...vitals, bp: e.target.value });
                        if (errors.bp) setErrors({ ...errors, bp: "" });
                      }}
                    />
                    {errors.bp && <div className="field-error">{errors.bp}</div>}
                  </div>
                  <div className="vitals-input-group">
                    <label>Pulse (bpm) *</label>
                    <input
                      type="number"
                      placeholder="72"
                      className={errors.pulse ? "input-error" : ""}
                      value={vitals.pulse}
                      onChange={(e) => {
                        setVitals({ ...vitals, pulse: e.target.value });
                        if (errors.pulse) setErrors({ ...errors, pulse: "" });
                      }}
                    />
                    {errors.pulse && <div className="field-error">{errors.pulse}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Symptoms & Observations</label>
                  <textarea
                    placeholder="Describe how the patient feels..."
                    className={errors.symptoms ? "input-error" : ""}
                    value={vitals.symptoms}
                    onChange={(e) => {
                      setVitals({ ...vitals, symptoms: e.target.value });
                      if (errors.symptoms) setErrors({ ...errors, symptoms: "" });
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: errors.symptoms ? "2px solid #ef4444" : "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  ></textarea>
                  {errors.symptoms && <div className="form-error">{errors.symptoms}</div>}
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
              <h3>Vitals History</h3>
            </div>
            <div className="patients-list-body">
              {vitalsRecords.length === 0 ? (
                <div className="no-patients-message">
                  No vitals recorded yet
                </div>
              ) : (
                <ul className="vitals-records-list">
                  {vitalsRecords.slice(0, 5).map((record) => (
                    <li key={record.id} className="vitals-record-item">
                      <div className="vitals-record-header">
                        <div className="vitals-record-name">{record.patientName}</div>
                        <div className="vitals-record-time">{record.timestamp}</div>
                      </div>
                      <div className="vitals-record-data">
                        <span className="vitals-data">🌡️ {record.temp}°C</span>
                        <span className="vitals-data">💓 {record.pulse} bpm</span>
                        <span className="vitals-data">📊 {record.bp}</span>
                      </div>
                      <div className="vitals-record-symptoms">
                        📝 {record.symptoms}
                      </div>
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
