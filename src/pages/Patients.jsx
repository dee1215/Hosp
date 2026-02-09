import { useState, useContext } from "react";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

/**
 * Patients Component
 * Handles patient lookup, registration, and secure check-in via OTP.
 */
function Patients() {
  const { patients, addPatient, updatePatientStatus } = useContext(DataContext);
  
  // Local state for modals and forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpStep, setOtpStep] = useState("generate"); // 'generate' or 'verify'

  // New patient state
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "Male" });

  const handleRegister = (e) => {
    e.preventDefault();
    const id = `PT${(patients.length + 1).toString().padStart(3, '0')}`;
    const patientToAdd = { id, ...newPatient, age: parseInt(newPatient.age) };
    addPatient(patientToAdd);
    setShowAddModal(false);
    setSuccessMessage(`Patient ${patientToAdd.name} registered successfully with ID ${patientToAdd.id}`);
    setNewPatient({ name: "", age: "", gender: "Male" });
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const startAttendance = (patient) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(otp);
    setSelectedPatient(patient);
    setOtpStep("generate");
    setShowOtpModal(true);
  };

  const verifyAttendance = () => {
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
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Patient Management</h2>
              {successMessage && (
                <div className="alert alert-success alert-dismissible mt-2" role="alert">
                  <div className="d-flex">
                    <strong>Success!</strong> &nbsp; {successMessage}
                  </div>
                </div>
              )}
            </div>
            <div className="col-auto ms-auto">
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                + Register New Patient
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th className="w-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td className="text-muted font-monospace">{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.age}</td>
                      <td>{p.gender}</td>
                      <td>
                        <span className={`badge ${p.status === 'Registered' ? 'bg-secondary' : 'bg-info'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          disabled={p.status !== 'Registered'}
                          onClick={() => startAttendance(p)}
                        >
                          {p.status === 'Registered' ? 'Start Check-in' : 'Checked In'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="modal modal-blur show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">New Patient Registration</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleRegister}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" required 
                      value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input type="number" className="form-control" required
                          value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select className="form-select" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-link link-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary ms-auto">Register Patient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP Attendance Modal */}
      {showOtpModal && (
        <div className="modal modal-blur show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Patient Attendance (OTP)</h5>
                <button className="btn-close" onClick={() => setShowOtpModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                {otpStep === 'generate' ? (
                  <>
                    <div className="mb-3">Share this code with <strong>{selectedPatient.name}</strong></div>
                    <div className="h1 text-primary" style={{ fontSize: '3rem', letterSpacing: '0.5rem' }}>{generatedOtp}</div>
                    <button className="btn btn-primary mt-4" onClick={() => setOtpStep("verify")}>
                      Proceed to Verification
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-3">Enter the OTP provided by the patient</div>
                    <input type="text" className="form-control form-control-lg text-center font-monospace" 
                      placeholder="0000" maxLength="4" style={{ fontSize: '2rem' }}
                      value={enteredOtp} onChange={e => setEnteredOtp(e.target.value)} />
                    <button className="btn btn-success mt-4 w-100" onClick={verifyAttendance}>
                      Confirm & Check-in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Patients;
