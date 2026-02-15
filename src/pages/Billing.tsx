import { useState, useMemo, useCallback } from "react";

import Layout from "../components/Layout";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { getMedicinePrice } from "../data/medicines";
import type { Invoice } from "../types";
import "./Billing.css";

/**
 * Billing Component
 * Generates final invoices for patients after they have received their medications.
 */
export default function Billing() {
  const { patients, invoices, setInvoices, updatePatientStatus, prescriptions } = useData();
  const { addToast } = useToast();

  const [patientId, setPatientId] = useState("");

  // Filter: Patients who have finished pharmacy stage
  const payablePatients = patients.filter((p) => p.status === "Medicines Dispensed");

  // Calculate medication charges based on patient's prescription
  const getMedicationCost = useCallback((pId: string): number => {
    const prescription = prescriptions.find((p) => p.patientId === pId);
    if (!prescription) return 0;

    return prescription.medications.reduce((total, med) => {
      const price = getMedicinePrice(med.name);
      const quantity = med.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }, [prescriptions]);

  const consultationFee = 50;
  
  const medicationCost = useMemo(() => getMedicationCost(patientId), [patientId, getMedicationCost]);
  
  const billItems = useMemo(() => [
    { desc: "Consultation Fee", amount: consultationFee },
    { desc: "Medication Charges", amount: medicationCost }
  ], [medicationCost]);

  const subtotal = billItems.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleGenerateInvoice = () => {
    if (!patientId) {
      addToast("Please select a patient first", "error");
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;

    const newInvoice: Invoice = {
      id: Date.now(),
      invoiceNum,
      patientId,
      patientName: patient.name,
      total,
      timestamp: new Date().toLocaleString()
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    updatePatientStatus(patientId, "Billed");
    addToast(`Invoice ${invoiceNum} generated successfully`, "success");
    setPatientId("");
  };

  const handlePrint = (inv: Invoice) => {
    const prescription = prescriptions.find((p) => p.patientId === inv.patientId);
    const medicationCost = prescription
      ? prescription.medications.reduce((total, med) => {
          const price = getMedicinePrice(med.name);
          const quantity = med.quantity || 1;
          return total + (price * quantity);
        }, 0)
      : 0;

    const consultFee = consultationFee;
    const taxAmount = (consultFee + medicationCost) * 0.05;

    const win = window.open("", "", "width=800,height=600");
    if (!win) return;

    // Build medication table rows
    const medicationRows = prescription
      ? prescription.medications
          .map((med) => {
            const price = getMedicinePrice(med.name);
            const quantity = med.quantity || 1;
            const itemTotal = price * quantity;
            return `<tr>
              <td>${med.name} (${med.dosage}, Qty: ${quantity})</td>
              <td>GH₵ ${itemTotal.toFixed(2)}</td>
            </tr>`;
          })
          .join("")
      : "<tr><td colspan='2'>No medications</td></tr>";

    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.invoiceNum}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .details { margin-bottom: 20px; font-size: 0.95rem; }
            .details p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .section-title { margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
            .summary { margin-top: 20px; text-align: right; }
            .summary-row { display: flex; justify-content: flex-end; padding: 5px 0; }
            .summary-label { min-width: 150px; }
            .summary-amount { min-width: 100px; text-align: right; font-weight: bold; }
            .total-row { border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; font-size: 1.2rem; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HOSPITAL INVOICE</h1>
            <p>Invoice #: ${inv.invoiceNum}</p>
          </div>
          <div class="details">
            <p><strong>Patient Name:</strong> ${inv.patientName}</p>
            <p><strong>Patient ID:</strong> ${inv.patientId}</p>
            <p><strong>Date:</strong> ${inv.timestamp}</p>
          </div>

          <div class="section-title">📋 Medications Dispensed</div>
          <table>
            <thead>
              <tr><th>Medicine (Dosage, Qty)</th><th>Cost</th></tr>
            </thead>
            <tbody>
              ${medicationRows}
            </tbody>
          </table>

          <div class="section-title">💳 Cost Breakdown</div>
          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Consultation Fee</td><td>GH₵ ${consultFee.toFixed(2)}</td></tr>
            <tr><td>Medication Charges</td><td>GH₵ ${medicationCost.toFixed(2)}</td></tr>
            <tr><td>Subtotal</td><td>GH₵ ${(consultFee + medicationCost).toFixed(2)}</td></tr>
            <tr><td>Tax (5%)</td><td>GH₵ ${taxAmount.toFixed(2)}</td></tr>
          </table>

          <div class="summary">
            <div class="summary-row total-row">
              <span class="summary-label">TOTAL AMOUNT:</span>
              <span class="summary-amount">GH₵ ${inv.total.toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <Layout>
      <div className="billing-container">
        <div className="billing-header">
          <h1>💰 Billing Area - Invoice Generation</h1>
          <p>Generate and manage patient invoices</p>
        </div>

        <div className="billing-layout">
          {/* Invoice Generation Form */}
          <div className="invoice-form-card">
            <div className="card-header">
              <h3>New Invoice</h3>
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
                  {payablePatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bill-summary" style={{ display: patientId ? "block" : "none" }}>
                <p className="bill-summary-title">💵 Cost Summary</p>
                <div className="bill-item">
                  <span className="bill-label">Consultation Fee</span>
                  <span className="bill-amount">GH₵ {billItems[0].amount.toFixed(2)}</span>
                </div>
                <div className="bill-item">
                  <span className="bill-label">Medication Charges</span>
                  <span className="bill-amount">GH₵ {billItems[1].amount.toFixed(2)}</span>
                </div>
                <div className="bill-item">
                  <span className="bill-label">Tax (5%)</span>
                  <span className="bill-amount">GH₵ {(tax).toFixed(2)}</span>
                </div>
                <div className="bill-total">
                  <span className="bill-total-label">TOTAL</span>
                  <span className="bill-total-amount">GH₵ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn-generate"
                disabled={!patientId}
                onClick={handleGenerateInvoice}
              >
                Generate Invoice
              </button>
            </div>
          </div>

          {/* Invoices History */}
          <div className="invoices-card">
            <div className="invoices-header">
              <h3>Billing History ({invoices.length})</h3>
            </div>
            <div className="invoices-body">
              {invoices.length === 0 ? (
                <div className="no-invoices">
                  No invoices generated
                </div>
              ) : (
                <ul className="invoices-list">
                  {invoices.map((inv) => (
                    <li key={inv.id} className="invoice-item">
                      <div className="invoice-number">{inv.invoiceNum}</div>
                      <div className="invoice-patient">{inv.patientName}</div>
                      <div className="invoice-details">
                        <div className="invoice-detail-item">
                          <span className="detail-label">Patient ID</span>
                          <span className="detail-value">{inv.patientId}</span>
                        </div>
                        <div className="invoice-detail-item">
                          <span className="detail-label">Amount</span>
                          <span className="detail-value">GH₵ {inv.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="invoice-amount">
                        GH₵ {inv.total.toFixed(2)}
                      </div>
                      <div className="invoice-actions">
                        <button
                          className="btn-print"
                          onClick={() => handlePrint(inv)}
                        >
                          🖨️ Print
                        </button>
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
