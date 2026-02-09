import { useState, useContext } from "react";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

/**
 * Billing Component
 * Generates final invoices for patients after they have received their medications.
 */
function Billing() {
  const { patients, invoices, setInvoices, updatePatientStatus } = useContext(DataContext);
  
  const [patientId, setPatientId] = useState("");
  const [billItems, setBillItems] = useState([
    { desc: "Consultation Fee", amount: 50 },
    { desc: "Medication Charges", amount: 120 }
  ]);

  // Filter: Patients who have finished pharmacy stage
  const payablePatients = patients.filter(p => p.status === "Medicines Dispensed");

  const subtotal = billItems.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleGenerateInvoice = () => {
    if (!patientId) return;

    const patient = patients.find(p => p.id === patientId);
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    
    const newInvoice = {
      id: Date.now(),
      invoiceNum,
      patientId,
      patientName: patient.name,
      total,
      timestamp: new Date().toLocaleString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    updatePatientStatus(patientId, "Billed");
    setPatientId("");
  };

  const handlePrint = (inv) => {
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.invoiceNum}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
            .total { font-size: 1.5rem; text-align: right; margin-top: 30px; }
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
          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Consultation Fee</td><td>GH₵ 50.00</td></tr>
            <tr><td>Medication Charges</td><td>GH₵ 120.00</td></tr>
            <tr><td>Tax (5%)</td><td>GH₵ ${(inv.total - 170).toFixed(2)}</td></tr>
          </table>
          <div class="total">
            <strong>TOTAL AMOUNT: GH₵ ${inv.total.toFixed(2)}</strong>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Layout>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Billing Area - Invoice Generation</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {/* Generation Form */}
            <div className="col-md-5">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">New Invoice</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Select Patient</label>
                    <select className="form-select" value={patientId} onChange={e => setPatientId(e.target.value)}>
                      <option value="">Choose patient...</option>
                      {payablePatients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3 bg-light p-3 rounded">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Subtotal</span>
                      <strong>GH₵ {subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Tax (5%)</span>
                      <strong>GH₵ {tax.toFixed(2)}</strong>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between h3 mb-0">
                      <span>Total</span>
                      <strong className="text-primary">GH₵ {total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <button className="btn btn-primary w-100" disabled={!patientId} onClick={handleGenerateInvoice}>
                    Generate GH₵ Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div className="col-md-7">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">Billing History</h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Patient</th>
                        <th>Amount</th>
                        <th className="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan="4" className="text-center text-muted py-4">No invoices generated</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv.id}>
                            <td className="font-monospace">{inv.invoiceNum}</td>
                            <td>{inv.patientName}</td>
                            <td className="text-primary">GH₵ {inv.total.toFixed(2)}</td>
                            <td>
                              <button className="btn btn-sm btn-ghost-primary" onClick={() => handlePrint(inv)}>
                                Print
                              </button>
                            </td>
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

export default Billing;
