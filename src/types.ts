export type Role = "admin" | "nurse" | "doctor" | "pharmacist" | "billing";

export type PatientStatus =
  | "Registered"
  | "Waiting"
  | "Vitals Taken"
  | "Prescribed"
  | "Medicines Dispensed"
  | "Billed";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: PatientStatus;
  otp?: number | null;
};

export type VitalsForm = {
  temp: string;
  bp: string;
  pulse: string;
  symptoms: string;
};

export type VitalsRecord = VitalsForm & {
  id: number;
  patientId: string;
  patientName: string;
  timestamp: string;
};

export type Medication = {
  name: string;
  dosage: string;
  frequency: string;
};

export type Prescription = {
  id: number;
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: Medication[];
  timestamp: string;
};

export type Invoice = {
  id: number;
  invoiceNum: string;
  patientId: string;
  patientName: string;
  total: number;
  timestamp: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  stock: number;
  unit: string;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  department?: string;
};
