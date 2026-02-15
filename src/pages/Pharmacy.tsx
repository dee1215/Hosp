import { useState, useEffect } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { getMedicinePrice } from "../data/medicines";
import type { InventoryItem } from "../types";
import "./Pharmacy.css";

/**
 * Pharmacy Component
 * Handles medicine inventory and dispensing prescriptions to patients.
 */
export default function Pharmacy() {
  const { patients, prescriptions, updatePatientStatus } = useData();
  const { addToast } = useToast();

  // Initialize inventory from localStorage or with defaults
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("pharmacy_inventory");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading inventory from localStorage:", e);
      }
    }
    return [
      { id: 1, name: "Paracetamol 500mg", stock: 500, unit: "tabs", price: 0.50 },
      { id: 2, name: "Amoxicillin 500mg", stock: 120, unit: "capsules", price: 2.50 },
      { id: 3, name: "Ibuprofen 200mg", stock: 200, unit: "tabs", price: 0.75 },
      { id: 4, name: "Vitamin C 500mg", stock: 300, unit: "tabs", price: 0.80 },
      { id: 5, name: "Metformin 500mg", stock: 150, unit: "tabs", price: 1.20 },
      { id: 6, name: "Amlodipine 5mg", stock: 100, unit: "tabs", price: 2.50 },
      { id: 7, name: "Cough Syrup", stock: 50, unit: "bottles", price: 3.50 },
      { id: 8, name: "Antihistamine", stock: 80, unit: "tabs", price: 1.20 },
    ];
  });

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pharmacy_inventory", JSON.stringify(inventory));
  }, [inventory]);

  const [patientId, setPatientId] = useState("");
  const [dispensing, setDispensing] = useState(false);
  const [error, setError] = useState("");
  
  // New medicine form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    stock: 100,
    unit: "tabs",
    price: 0,
  });

  // Filter: Patients who have been prescribed medications
  const prescribedPatients = patients.filter((p) => p.status === "Prescribed");

  // Find the doctor's prescription for the selected patient
  const prescription = prescriptions.find((pr) => pr.patientId === patientId);

  // Calculate total cost for dispensing
  const calculateDispensingCost = () => {
    if (!prescription) return 0;
    return prescription.medications.reduce((total, med) => {
      const inventoryItem = inventory.find(item =>
        item.name.toLowerCase() === med.name.toLowerCase()
      );
      const quantity = med.quantity || 1;
      const price = inventoryItem?.price ?? getMedicinePrice(med.name);
      return total + (price * quantity);
    }, 0);
  };

  const handleDispense = () => {
    setError("");

    if (!patientId) {
      const msg = "Please select a patient first.";
      setError(msg);
      addToast(msg, "error");
      return;
    }

    if (!prescription) {
      const msg = "This patient does not have a valid prescription.";
      setError(msg);
      addToast(msg, "error");
      return;
    }

    // Check stock availability
    for (const med of prescription.medications) {
      const inventoryItem = inventory.find(item =>
        item.name.toLowerCase() === med.name.toLowerCase()
      );
      if (!inventoryItem) {
        const msg = `Medicine "${med.name}" not found in inventory. Please add it first.`;
        setError(msg);
        addToast(msg, "error");
        return;
      }
      if (inventoryItem.stock < (med.quantity || 1)) {
        const msg = `Insufficient stock for ${med.name}. Available: ${inventoryItem.stock}, Needed: ${med.quantity || 1}`;
        setError(msg);
        addToast(msg, "error");
        return;
      }
    }

    // Reduce stock
    const updatedInventory = inventory.map((item) => {
      const prescribedMed = prescription.medications.find((m) =>
        m.name.toLowerCase() === item.name.toLowerCase()
      );
      
      if (prescribedMed && prescribedMed.quantity) {
        const newStock = Math.max(0, item.stock - prescribedMed.quantity);
        return { ...item, stock: newStock };
      }
      
      return item;
    });

    setInventory(updatedInventory);
    updatePatientStatus(patientId, "Medicines Dispensed");

    addToast("Medicines dispensed successfully", "success");

    setDispensing(true);
    setError("");
    setTimeout(() => {
      setDispensing(false);
      setPatientId("");
    }, 2000);
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name.trim()) {
      addToast("Please enter a medicine name", "error");
      return;
    }
    if (newMedicine.price <= 0) {
      addToast("Please enter a valid price", "error");
      return;
    }

    const medicineExists = inventory.some(item => 
      item.name.toLowerCase() === newMedicine.name.toLowerCase()
    );

    if (medicineExists) {
      addToast("Medicine already exists in inventory", "error");
      return;
    }

    const newItem: InventoryItem = {
      id: Math.max(...inventory.map(i => i.id), 0) + 1,
      name: newMedicine.name,
      stock: newMedicine.stock,
      unit: newMedicine.unit as any,
      price: newMedicine.price,
    };

    setInventory([...inventory, newItem]);
    setNewMedicine({ name: "", stock: 100, unit: "tabs", price: 0 });
    setShowAddForm(false);
    addToast("Medicine added successfully", "success");
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
              <div className="card-header-row">
                <h3>💊 Medicine Inventory</h3>
                <button
                  type="button"
                  className="btn-add-medication"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add Medicine
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Stock Level</th>
                    <th>Unit</th>
                    <th>Price (GHC)</th>
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
                        <span style={{ fontWeight: "600", color: "var(--primary)" }}>GHC {item.price.toFixed(2)}</span>
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
                  className={`form-select ${error && !patientId ? "input-error" : ""}`}
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">Choose patient...</option>
                  {prescribedPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
                {error && <div className="form-error">{error}</div>}
              </div>

              {prescription ? (
                <div className="prescription-details">
                  <p className="prescription-title">📋 Prescription Details</p>
                  <div className="prescription-diagnosis">
                    <strong>Diagnosis:</strong>
                    <div>{prescription.diagnosis}</div>
                  </div>
                  <ul className="medications-list">
                    {prescription.medications.map((m, i) => {
                      const itemPrice = inventory.find(item =>
                        item.name.toLowerCase() === m.name.toLowerCase()
                      )?.price ?? getMedicinePrice(m.name);
                      const qty = m.quantity || 1;
                      const total = itemPrice * qty;
                      return (
                        <li key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{m.name} - {m.dosage} ({m.frequency})</span>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              {qty}x @ GHC{itemPrice.toFixed(2)} = GHC{total.toFixed(2)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="dispensing-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total Cost:</span>
                      <span style={{ fontWeight: "700", color: "var(--primary)", fontSize: "16px" }}>
                        GHC {calculateDispensingCost().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-prescription">
                  Select a patient to view their prescription
                </div>
              )}

              <button
                className={`btn-dispense ${dispensing ? "loading" : ""}`}
                disabled={!prescription || dispensing || error.length > 0}
                onClick={handleDispense}
              >
                {dispensing ? "Dispensing..." : "Confirm Dispensing"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddForm && (
        <div
          className="pharmacy-modal-overlay"
          onClick={() => setShowAddForm(false)}
          role="presentation"
        >
          <div
            className="pharmacy-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-medicine-title"
          >
            <div className="pharmacy-modal-header">
              <h3 id="add-medicine-title">Add New Medicine</h3>
              <button
                type="button"
                className="pharmacy-modal-close"
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMedicine();
              }}
            >
              <div className="pharmacy-modal-body">
                <div className="pharmacy-form-group">
                  <label className="pharmacy-form-label pharmacy-form-label-required">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Paracetamol 500mg"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    className="pharmacy-form-input"
                  />
                </div>
                <div className="pharmacy-form-row">
                  <div className="pharmacy-form-group">
                    <label className="pharmacy-form-label pharmacy-form-label-required">
                      Price (GHC)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newMedicine.price || ""}
                      onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.05"
                      className="pharmacy-form-input"
                    />
                  </div>
                  <div className="pharmacy-form-group">
                    <label className="pharmacy-form-label">Stock</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={newMedicine.stock}
                      onChange={(e) => setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value, 10) || 0 })}
                      min="0"
                      className="pharmacy-form-input"
                    />
                  </div>
                </div>
                <div className="pharmacy-form-group">
                  <label className="pharmacy-form-label">Unit</label>
                  <select
                    value={newMedicine.unit}
                    onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })}
                    className="pharmacy-form-input"
                  >
                    <option value="tabs">tabs</option>
                    <option value="capsules">capsules</option>
                    <option value="ml">ml</option>
                    <option value="bottles">bottles</option>
                    <option value="injection">injection</option>
                  </select>
                </div>
              </div>
              <div className="pharmacy-modal-footer">
                <button
                  type="button"
                  className="pharmacy-btn-cancel"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pharmacy-btn-submit">
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
