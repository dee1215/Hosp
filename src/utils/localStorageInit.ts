import type { Patient } from "../types";

/**
 * Initialize localStorage with default data if it doesn't exist
 */
export const initializeLocalStorage = () => {
  // Check if localStorage is available (not during server-side rendering)
  if (typeof localStorage !== "undefined") {
    // Initialize with default patients if not already stored
    if (!localStorage.getItem("patients")) {
      const defaultPatients: Patient[] = [
        {
          id: "PT001",
          name: "Desmond Bokor",
          age: 32,
          gender: "Male",
          status: "Registered"
        },
        {
          id: "PT002",
          name: "Black Widow",
          age: 27,
          gender: "Female",
          status: "Registered"
        }
      ];
      localStorage.setItem("patients", JSON.stringify(defaultPatients));
    }

    // Initialize with empty arrays for other data types
    if (!localStorage.getItem("vitalsRecords")) {
      localStorage.setItem("vitalsRecords", JSON.stringify([]));
    }

    if (!localStorage.getItem("prescriptions")) {
      localStorage.setItem("prescriptions", JSON.stringify([]));
    }

    if (!localStorage.getItem("invoices")) {
      localStorage.setItem("invoices", JSON.stringify([]));
    }
  }
};
