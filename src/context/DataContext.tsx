import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type SetStateAction
} from "react";

import patientsData from "../data/patients";
import type {
  Invoice,
  Patient,
  PatientStatus,
  Prescription,
  VitalsRecord
} from "../types";

type DataContextValue = {
  patients: Patient[];
  vitalsRecords: VitalsRecord[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  updatePatientStatus: (
    patientId: string,
    newStatus: PatientStatus,
    otp?: number | null
  ) => void;
  addPatient: (patient: Omit<Patient, "status">) => void;
  addVitals: (record: VitalsRecord) => void;
  setPrescriptions: (action: SetStateAction<Prescription[]>) => void;
  setInvoices: (action: SetStateAction<Invoice[]>) => void;
};

export const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}

type DataProviderProps = {
  children: ReactNode;
};

function loadDataFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from localStorage for key ${key}:`, error);
    return defaultValue;
  }
}

function saveDataToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
  }
}

function applyStateAction<T>(prev: T, action: SetStateAction<T>): T {
  return typeof action === "function" ? (action as (p: T) => T)(prev) : action;
}

export default function DataProvider({ children }: DataProviderProps) {
  const [patients, setPatients] = useState<Patient[]>(() =>
    loadDataFromStorage("patients", patientsData)
  );
  const [vitalsRecords, setVitalsRecords] = useState<VitalsRecord[]>(() =>
    loadDataFromStorage("vitalsRecords", [])
  );
  const [prescriptions, setPrescriptionsState] = useState<Prescription[]>(() =>
    loadDataFromStorage("prescriptions", [])
  );
  const [invoices, setInvoicesState] = useState<Invoice[]>(() =>
    loadDataFromStorage("invoices", [])
  );

  const setPrescriptions = (action: SetStateAction<Prescription[]>) => {
    setPrescriptionsState((prev) => {
      const next = applyStateAction(prev, action);
      saveDataToStorage("prescriptions", next);
      return next;
    });
  };

  const setInvoices = (action: SetStateAction<Invoice[]>) => {
    setInvoicesState((prev) => {
      const next = applyStateAction(prev, action);
      saveDataToStorage("invoices", next);
      return next;
    });
  };

  const updatePatientStatus = (
    patientId: string,
    newStatus: PatientStatus,
    otp: number | null = null
  ) => {
    setPatients((prev) => {
      const updatedPatients = prev.map((p) =>
        p.id === patientId ? { ...p, status: newStatus, otp } : p
      );
      saveDataToStorage("patients", updatedPatients);
      return updatedPatients;
    });
  };

  const addPatient = (patient: Omit<Patient, "status">) => {
    setPatients((prev) => {
      const newPatient: Patient = { ...patient, status: "Registered" };
      const updatedPatients = [...prev, newPatient];
      saveDataToStorage("patients", updatedPatients);
      return updatedPatients;
    });
  };

  const addVitals = (record: VitalsRecord) => {
    setVitalsRecords((prev) => {
      const updatedVitalsRecords = [record, ...prev];
      saveDataToStorage("vitalsRecords", updatedVitalsRecords);
      return updatedVitalsRecords;
    });

    updatePatientStatus(record.patientId, "Vitals Taken");
  };

  const value: DataContextValue = {
    patients,
    vitalsRecords,
    prescriptions,
    invoices,
    updatePatientStatus,
    addPatient,
    addVitals,
    setPrescriptions,
    setInvoices
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
