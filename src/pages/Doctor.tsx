import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { filterMedicines, commonMedicines, type BasicMedicine } from "../data/medicines";
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
    setPrescriptions,
    updatePatientStatus
  } = useData();
  const { addToast } = useToast();

  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState<Medication[]>([{ name: "", dosage: "", frequency: "", quantity: 0 }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [medSuggestions, setMedSuggestions] = useState<Record<number, BasicMedicine[]>>({});

  // Filter: Patients ready for the doctor
  const readyPatients = patients.filter((p) => p.status === "Vitals Taken");

  // Find the nurse's report for the selected patient
  const nurseReport = vitalsRecords.find((r) => r.patientId === patientId);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!patientId) {
      newErrors.patientId = "Please select a patient.";
    }

    if (!diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required.";
    }

    // Check medications - each filled field should have all four fields filled
    const filledMeds = meds.filter((m) => m.name || m.dosage || m.frequency);
    const completeMeds = filledMeds.every((m) => m.name && m.dosage && m.frequency && m.quantity && m.quantity > 0);

    if (filledMeds.length > 0 && !completeMeds) {
      newErrors.medications =
        "For each medication, all fields (name, dosage, frequency, quantity) are required with quantity > 0.";
    }

    if (meds.every((m) => !m.name)) {
      newErrors.medications = "Please add at least one complete medication.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMedication = () => {
    setMeds([...meds, { name: "", dosage: "", frequency: "", quantity: 0 }]);
    if (errors.medications) setErrors({ ...errors, medications: "" });
  };

  const handleMedChange = (index: number, field: keyof Medication, value: string | undefined) => {
    const safeValue = value ?? "";
    const updatedMeds = meds.map((m, i) => {
      if (i === index) {
        if (field === "quantity") {
          const num = parseInt(safeValue, 10);
          return { ...m, [field]: Number.isNaN(num) ? 0 : num };
        }
        return { ...m, [field]: safeValue };
      }
      return m;
    });
    setMeds(updatedMeds);

    // Show suggestions when typing medicine name (or all if clearing)
    if (field === "name") {
      showMedicineSuggestions(index, safeValue);
    }
  };

  const selectMedicineSuggestion = (index: number, medicineName: string) => {
    handleMedChange(index, "name", medicineName);
    setMedSuggestions((prev) => ({ ...prev, [index]: [] }));
  };

  const showMedicineSuggestions = (index: number, value: string | undefined) => {
    const q = (value ?? "").trim();
    if (q) {
      setMedSuggestions((prev) => ({ ...prev, [index]: filterMedicines(q) }));
    } else {
      setMedSuggestions((prev) => ({ ...prev, [index]: commonMedicines.slice(0, 8) }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
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

    addToast("Prescription issued successfully", "success");

    // Reset form
    setPatientId("");
    setDiagnosis("");
    setMeds([{ name: "", dosage: "", frequency: "", quantity: 0 }]);
    setErrors({});
  };

  return (
    <Layout>
      <div className="doctor-container">
        <div className="doctor-header">
          <h1>👨‍⚕️ Doctor Area - Diagnosis & Prescription</h1>
          <p>Review patient vitals, diagnose, and issue prescriptions</p>
        </div>

        <div className="doctor-layout">
          {/* Consultation Form - same structure as Nurse "Record Patient Vitals" */}
          <div className="doctor-form-card">
            <div className="form-header">
              <h3>Patient Consultation</h3>
            </div>
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label form-label-required">
                    Select Patient (Ready for Consultation)
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
                  {errors.patientId && <div className="form-error">{errors.patientId}</div>}
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
                    className={`form-input ${errors.diagnosis ? "input-error" : ""}`}
                    placeholder="Enter your diagnosis..."
                    required
                    value={diagnosis}
                    onChange={(e) => {
                      setDiagnosis(e.target.value);
                      if (errors.diagnosis) setErrors({ ...errors, diagnosis: "" });
                    }}
                  ></textarea>
                  {errors.diagnosis && <div className="form-error">{errors.diagnosis}</div>}
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

                  {errors.medications && <div className="form-error" style={{ marginBottom: "12px" }}>{errors.medications}</div>}

                  <div className="medications-list">
                    {meds.map((m, index) => (
                      <div key={index} className={`medication-item ${errors.medications && (!m.name || !m.dosage || !m.frequency || !m.quantity) ? "has-error" : ""}`}>
                        <div className="medication-input">
                          <label>Medicine Name</label>
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              placeholder="e.g., Paracetamol"
                              className={!m.name && errors.medications ? "input-error" : ""}
                              value={m.name}
                              onChange={(e) => {
                                handleMedChange(index, "name", e.target.value);
                                if (errors.medications) setErrors({ ...errors, medications: "" });
                              }}
                              onFocus={() => showMedicineSuggestions(index, m.name ?? "")}
                            />
                            {medSuggestions[index] && medSuggestions[index].length > 0 && (
                              <div
                                className="autocomplete-suggestions"
                                onWheel={(e) => e.stopPropagation()}
                              >
                                {medSuggestions[index].map((med) => (
                                  <div
                                    key={med.name}
                                    className="suggestion-item"
                                    onClick={() => selectMedicineSuggestion(index, med.name)}
                                  >
                                    {med.name} <span style={{ fontSize: "0.85rem", color: "#666" }}>GH₵ {med.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="medication-input">
                          <label>Dosage</label>
                          <input
                            type="text"
                            placeholder="e.g., 500mg"
                            className={!m.dosage && errors.medications ? "input-error" : ""}
                            value={m.dosage}
                            onChange={(e) => {
                              handleMedChange(index, "dosage", e.target.value);
                              if (errors.medications) setErrors({ ...errors, medications: "" });
                            }}
                          />
                        </div>
                        <div className="medication-input">
                          <label>Frequency</label>
                          <input
                            type="text"
                            placeholder="e.g., 3x daily"
                            className={!m.frequency && errors.medications ? "input-error" : ""}
                            value={m.frequency}
                            onChange={(e) => {
                              handleMedChange(index, "frequency", e.target.value);
                              if (errors.medications) setErrors({ ...errors, medications: "" });
                            }}
                          />
                        </div>
                        <div className="medication-input">
                          <label>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g., 20"
                            className={!m.quantity && errors.medications ? "input-error" : ""}
                            value={m.quantity || ""}
                            onChange={(e) => {
                              handleMedChange(index, "quantity", e.target.value);
                              if (errors.medications) setErrors({ ...errors, medications: "" });
                            }}
                          />
                        </div>
                        {meds.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-med"
                            onClick={() => {
                              const updatedMeds = meds.filter((_, i) => i !== index);
                              setMeds(updatedMeds);
                              setMedSuggestions((prev) => {
                                const next: Record<number, BasicMedicine[]> = {};
                                updatedMeds.forEach((_, i) => {
                                  const oldIdx = i < index ? i : i + 1;
                                  if (prev[oldIdx] !== undefined) next[i] = prev[oldIdx];
                                });
                                return next;
                              });
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

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Issue Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Ready for Consultation List - same structure as Nurse "Vitals History" */}
          <div className="patients-list-card">
            <div className="form-header">
              <h3>Ready for Consultation ({readyPatients.length})</h3>
            </div>
            <div className="patients-list-body">
              {readyPatients.length === 0 ? (
                <div className="no-patients-message">
                  No patients ready for consultation
                </div>
              ) : (
                <ul className="patients-ready-list">
                  {readyPatients.map((p) => (
                    <li
                      key={p.id}
                      className={`patient-item ${patientId === p.id ? "active" : ""}`}
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
