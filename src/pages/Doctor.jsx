import { useState, useContext } from "react";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

/**
 * Doctor Component
 * Where doctors review nurse vitals, diagnose, and issue prescriptions.
 */
function Doctor() {
  const { patients, vitalsRecords, prescriptions, setPrescriptions, updatePatientStatus } = useContext(DataContext);
  
  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState([{ name: "", dosage: "", frequency: "" }]);
  const [submitted, setSubmitted] = useState(false);

  // Filter: Patients ready for the doctor
  const readyPatients = patients.filter(p => p.status === "Vitals Taken");
  
  // Find the nurse's report for the selected patient
  const nurseReport = vitalsRecords.find(r => r.patientId === patientId);

  const addMedication = () => {
    setMeds([...meds, { name: "", dosage: "", frequency: "" }]);
  };

  const handleMedChange = (index, field, value) => {
    const updatedMeds = meds.map((m, i) => i === index ? { ...m, [field]: value } : m);
    setMeds(updatedMeds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId || !diagnosis) {
      alert("Please select a patient and enter a diagnosis.");
      return;
    }

    const patient = patients.find(p => p.id === patientId);
    
    const newPrescription = {
      id: Date.now(),
      patientId,
      patientName: patient.name,
      diagnosis,
      medications: meds.filter(m => m.name !== ""), // Only save filled meds
      timestamp: new Date().toLocaleString()
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
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
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Doctor Area - Diagnosis & Prescription</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Patient Consultation</h3>
                </div>
                <div className="card-body">
                  {submitted && (
                    <div className="alert alert-success mb-3">Prescription issued successfully!</div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Select Patient</label>
                      <select className="form-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
                        <option value="">Choose patient...</option>
                        {readyPatients.length > 0 ? (
                          readyPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                          ))
                        ) : (
                          <option value="" disabled>No patients ready for consultation</option>
                        )}
                      </select>
                      {readyPatients.length === 0 && (
                        <div className="form-text text-muted">No patients with vitals recorded yet. Please ensure patients have been checked in and vitals recorded by the nurse.</div>
                      )}
                    </div>

                    {/* Nurse's Report Display */}
                    {nurseReport && (
                      <div className="alert alert-info mb-3">
                        <h4 className="alert-title">Nurse's Report</h4>
                        <div className="row mt-2">
                          <div className="col-4"><strong>Temp:</strong> {nurseReport.temp}°C</div>
                          <div className="col-4"><strong>BP:</strong> {nurseReport.bp}</div>
                          <div className="col-4"><strong>Pulse:</strong> {nurseReport.pulse} bpm</div>
                        </div>
                        <div className="mt-2 text-muted"><strong>Symptoms:</strong> {nurseReport.symptoms || "None reported"}</div>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Diagnosis</label>
                      <textarea className="form-control" rows="3" required
                        value={diagnosis} onChange={e => setDiagnosis(e.target.value)}></textarea>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label mb-0">Prescription (Medications)</label>
                        <button type="button" className="btn btn-sm btn-ghost-primary" onClick={addMedication}>
                          + Add Medicine
                        </button>
                      </div>
                      
                      {meds.map((m, index) => (
                        <div key={index} className="row g-2 mb-2 bg-light p-2 rounded">
                          <div className="col-5">
                            <input type="text" className="form-control" placeholder="Medicine Name" 
                              value={m.name} onChange={e => handleMedChange(index, "name", e.target.value)} />
                          </div>
                          <div className="col-3">
                            <input type="text" className="form-control" placeholder="Dosage" 
                              value={m.dosage} onChange={e => handleMedChange(index, "dosage", e.target.value)} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="Frequency" 
                              value={m.frequency} onChange={e => handleMedChange(index, "frequency", e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Issue Prescription & Forward to Pharmacy</button>
                  </form>
                </div>
              </div>
            </div>

            {/* Prescription History */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Recent Prescriptions</h3>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {prescriptions.length === 0 ? (
                      <div className="p-4 text-center text-muted">No prescriptions issued yet</div>
                    ) : (
                      prescriptions.map(p => (
                        <div key={p.id} className="list-group-item">
                          <div className="row">
                            <div className="col">
                              <strong>{p.patientName}</strong>
                              <div className="text-muted small">{p.diagnosis}</div>
                            </div>
                            <div className="col-auto text-muted small">{p.timestamp.split(',')[1]}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Doctor;
