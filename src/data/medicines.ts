// Common medicines database
export const commonMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Azithromycin",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Omeprazole",
  "Ranitidine",
  "Amladinepine",
  "Amlodipine",
  "Losartan",
  "Hydrochlorthiazide",
  "Furosemide",
  "Glibenclamide",
  "Insulin",
  "Warfarin",
  "Heparin",
  "Clopidogrel",
  "Simvastatin",
  "Pravastatin",
  "Enalapril",
  "Ramipril",
  "Vitamin C",
  "Vitamin D",
  "Multivitamin",
  "Zinc",
  "Iron",
  "Calcium",
  "Magnesium",
  "Probiotic",
  "Cough Syrup",
  "Antacid",
  "Laxative",
  "Antihistamine",
  "Decongestant",
];

export function filterMedicines(query: string): string[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return commonMedicines.filter(m => m.toLowerCase().includes(lowerQuery)).slice(0, 5);
}
