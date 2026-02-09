import { createContext, useState } from "react";
import patientsData from "../data/patients";

// 1. Create the Context object
export const DataContext = createContext();

/**
 * DataProvider Component
 * This is the "Brain" of the app. It holds all the lists:
 * - Patients
 * - Vitals Records
 * - Prescriptions
 * - Invoices
 */
const DataProvider = ({ children }) => {
  // Helper function to load data from localStorage
  const loadDataFromStorage = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading data from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  };

  // Helper function to save data to localStorage
  const saveDataToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage for key ${key}:`, error);
    }
  };

  // Global State with localStorage persistence
  const [patients, setPatients] = useState(() => loadDataFromStorage("patients", patientsData));
  const [vitalsRecords, setVitalsRecords] = useState(() => loadDataFromStorage("vitalsRecords", []));
  const [prescriptions, setPrescriptions] = useState(() => loadDataFromStorage("prescriptions", []));
  const [invoices, setInvoices] = useState(() => loadDataFromStorage("invoices", []));

  // Helper function to update a patient's status (e.g., from 'Registered' to 'Waiting')
  const updatePatientStatus = (patientId, newStatus, otp = null) => {
    const updatedPatients = patients.map(p =>
      p.id === patientId ? { ...p, status: newStatus, otp: otp } : p
    );
    setPatients(updatedPatients);
    saveDataToStorage("patients", updatedPatients);
  };

  // Helper to add a new patient to the list
  const addPatient = (patient) => {
    const newPatient = { ...patient, status: "Registered" };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    saveDataToStorage("patients", updatedPatients);
  };

  // Helper to save vitals recorded by the Nurse
  const addVitals = (record) => {
    const updatedVitalsRecords = [record, ...vitalsRecords];
    setVitalsRecords(updatedVitalsRecords);
    saveDataToStorage("vitalsRecords", updatedVitalsRecords);
    updatePatientStatus(record.patientId, "Vitals Taken");
  };

  // The value we provide to all components
  const value = {
    patients,
    vitalsRecords,
    prescriptions,
    invoices,
    updatePatientStatus,
    addPatient,
    addVitals,
    setPrescriptions: (data) => {
      setPrescriptions(data);
      saveDataToStorage("prescriptions", data);
    },
    setInvoices: (data) => {
      setInvoices(data);
      saveDataToStorage("invoices", data);
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;