import { useState, useContext } from "react";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

/**
 * Nurse Component
 * Where nurses record vital signs and symptoms for patients who have checked in.
 */
function Nurse() {
  const { patients, vitalsRecords, addVitals } = useContext(DataContext);
  
  // Local state for the form
  const [patientId, setPatientId] = useState("");
  const [vitals, setVitals] = useState({
    temp: "",
    bp: "",
    pulse: "",
    symptoms: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Filter: Only patients waiting after OTP check-in
  const waitingPatients = patients.filter(p => p.status === "Waiting");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId) {
      alert("Please select a patient first.");
      return;
    }

    const patient = patients.find(p => p.id === patientId);
    
    // Create the record
    const record = {
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
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Nurse Area - Patient Vitals</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {/* Vitals Form */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Record Vitals</h3>
                </div>
                <div className="card-body">
                  {submitted && (
                    <div className="alert alert-success alert-dismissible" role="alert">
                      <div className="d-flex">
                        <strong>Success!</strong> &nbsp; Vitals recorded.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Select Patient (Waiting List)</label>
                      <select className="form-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
                        <option value="">Choose patient...</option>
                        {waitingPatients.length > 0 ? (
                          waitingPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                          ))
                        ) : (
                          <option value="" disabled>No patients waiting</option>
                        )}
                      </select>
                      {waitingPatients.length === 0 && (
                        <div className="form-text text-muted">No patients are currently waiting. Please ensure patients have been checked in via OTP.</div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-4">
                        <div className="mb-3">
                          <label className="form-label">Temp (°C)</label>
                          <input type="number" step="0.1" className="form-control" placeholder="36.5" 
                            value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="mb-3">
                          <label className="form-label">Blood Pressure</label>
                          <input type="text" className="form-control" placeholder="120/80" 
                            value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="mb-3">
                          <label className="form-label">Pulse (bpm)</label>
                          <input type="number" className="form-control" placeholder="72" 
                            value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Symptoms & Observations</label>
                      <textarea className="form-control" rows="3" placeholder="Describe how the patient feels..."
                        value={vitals.symptoms} onChange={e => setVitals({...vitals, symptoms: e.target.value})}></textarea>
                    </div>

                    <div className="form-footer">
                      <button type="submit" className="btn btn-primary w-100">
                        Save Vitals & Forward to Doctor
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Recent History Table */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Recent Vitals Log</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-vcenter card-table text-nowrap">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Temp</th>
                        <th>BP</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitalsRecords.length === 0 ? (
                        <tr><td colSpan="4" className="text-center text-muted py-4">No records yet</td></tr>
                      ) : (
                        vitalsRecords.map(r => (
                          <tr key={r.id}>
                            <td>{r.patientName}</td>
                            <td>{r.temp}°C</td>
                            <td>{r.bp}</td>
                            <td className="text-muted small">{r.timestamp.split(',')[1]}</td>
                          </tr>
                        ))
                      )}
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

export default Nurse;
