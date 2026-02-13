import { useState } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import type { InventoryItem } from "../types";

/**
 * Pharmacy Component
 * Handles medicine inventory and dispensing prescriptions to patients.
 */
export default function Pharmacy() {
  const { patients, prescriptions, updatePatientStatus } = useData();

  // Local inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Paracetamol", stock: 500, unit: "tabs" },
    { id: 2, name: "Amoxicillin", stock: 120, unit: "tabs" },
    { id: 3, name: "Ibuprofen", stock: 200, unit: "tabs" },
    { id: 4, name: "Vitamin C", stock: 300, unit: "tabs" }
  ]);

  const [patientId, setPatientId] = useState("");
  const [dispensing, setDispensing] = useState(false);

  // Filter: Patients who have been prescribed medications
  const prescribedPatients = patients.filter((p) => p.status === "Prescribed");

  // Find the doctor's prescription for the selected patient
  const prescription = prescriptions.find((pr) => pr.patientId === patientId);

  const handleDispense = () => {
    if (!patientId || !prescription) return;

    // Simulate stock reduction (e.g., reduce by 10 for each med)
    const updatedInventory = inventory.map((item) => {
      const isPrescribed = prescription.medications.some((m) =>
        m.name.toLowerCase().includes(item.name.toLowerCase())
      );
      return isPrescribed ? { ...item, stock: item.stock - 10 } : item;
    });

    setInventory(updatedInventory);
    updatePatientStatus(patientId, "Medicines Dispensed");

    setDispensing(true);
    setTimeout(() => {
      setDispensing(false);
      setPatientId("");
    }, 2000);
  };

  return (
    <Layout>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Pharmacy Area - Medicine Dispensing</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {/* Inventory Table */}
            <div className="col-md-7">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Medicine Inventory</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Stock Level</th>
                        <th>Unit</th>
                        <th className="w-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.stock}</td>
                          <td>{item.unit}</td>
                          <td>
                            <span
                              className={`badge ${item.stock > 100 ? "bg-success" : "bg-warning"}`}
                            >
                              {item.stock > 100 ? "In Stock" : "Low Stock"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Dispensing Form */}
            <div className="col-md-5">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Dispense Prescription</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Select Patient</label>
                    <select
                      className="form-select"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    >
                      <option value="">Choose patient...</option>
                      {prescribedPatients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {prescription ? (
                    <div className="mb-3 border p-3 rounded bg-light">
                      <h4 className="mb-2 text-primary">Prescription Details</h4>
                      <p className="mb-1">
                        <strong>Diagnosis:</strong> {prescription.diagnosis}
                      </p>
                      <ul className="mb-0 small">
                        {prescription.medications.map((m, i) => (
                          <li key={i}>
                            {m.name} - {m.dosage} ({m.frequency})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      Select a patient to see their prescription
                    </div>
                  )}

                  <button
                    className={`btn btn-primary w-100 ${dispensing ? "btn-loading" : ""}`}
                    disabled={!prescription || dispensing}
                    onClick={handleDispense}
                  >
                    {dispensing ? "Dispensing..." : "Confirm Dispensing"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
