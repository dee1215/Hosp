import { useState } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import type { InventoryItem } from "../types";
import "./Pharmacy.css";

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
      <div className="pharmacy-container">
        <div className="pharmacy-header">
          <h1>💊 Pharmacy Area - Medicine Dispensing</h1>
          <p>Manage inventory and dispense prescriptions</p>
        </div>

        <div className="pharmacy-layout">
          {/* Inventory Table */}
          <div className="inventory-card">
            <div className="card-header">
              <h3>💊 Medicine Inventory</h3>
            </div>
            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Stock Level</th>
                    <th>Unit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="medicine-name">
                          <span className="medicine-badge"></span>
                          {item.name}
                        </span>
                      </td>
                      <td>
                        <span className="stock-level">{item.stock}</span>
                      </td>
                      <td>
                        <span className="unit-label">{item.unit}</span>
                      </td>
                      <td>
                        <span className={`stock-status ${item.stock > 100 ? "status-in-stock" : "status-low-stock"}`}>
                          {item.stock > 100 ? "In Stock" : "Low Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dispensing Form */}
          <div className="dispensing-card">
            <div className="card-header">
              <h3>Dispense Prescription</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label form-label-required">Select Patient</label>
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
                <div className="prescription-details">
                  <p className="prescription-title">📋 Prescription Details</p>
                  <div className="prescription-diagnosis">
                    <strong>Diagnosis:</strong>
                    <div>{prescription.diagnosis}</div>
                  </div>
                  <ul className="medications-list">
                    {prescription.medications.map((m, i) => (
                      <li key={i}>
                        {m.name} - {m.dosage} ({m.frequency})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="no-prescription">
                  Select a patient to view their prescription
                </div>
              )}

              <button
                className={`btn-dispense ${dispensing ? "loading" : ""}`}
                disabled={!prescription || dispensing}
                onClick={handleDispense}
              >
                {dispensing ? "Dispensing..." : "Confirm Dispensing"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
