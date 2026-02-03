import { useState } from "react";
import Layout from "../components/Layout";
import patientsData from "../data/patients";

function Patients() {
  const [patients, setPatients] = useState(patientsData);

  const attendPatient = (id) => {
    const otp = Math.floor(1000 + Math.random() * 9000);

    const updatedPatients = patients.map((patient) =>
      patient.id === id
        ? { ...patient, status: "Attended", otp }
        : patient
    );

    setPatients(updatedPatients);
    alert(`OTP for patient: ${otp}`);
  };

  return (
    <Layout>
      <h2>Registered Patients</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => attendPatient(patient.id)}
                  disabled={patient.status === "Attended"}
                >
                  Attend
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Patients;
