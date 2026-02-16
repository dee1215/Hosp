// Medicine database with prices (in GHC)
export type BasicMedicine = { name: string; price: number };

export const commonMedicines: BasicMedicine[] = [
  // Painkillers
  { name: "Paracetamol", price: 0.50 },
  { name: "Ibuprofen", price: 0.75 },
  { name: "Aspirin", price: 0.40 },
  { name: "Diclofenac", price: 1.20 },
  
  // Antibiotics
  { name: "Amoxicillin", price: 2.50 },
  { name: "Azithromycin", price: 3.50 },
  { name: "Ciprofloxacin", price: 2.00 },
  { name: "Tetracycline", price: 1.80 },
  
  // Antacids & Digestives
  { name: "Omeprazole", price: 1.50 },
  { name: "Ranitidine", price: 1.00 },
  { name: "Antacid Liquid", price: 4.50 },
  { name: "Metoclopramide", price: 0.60 },
  
  // Diabetes
  { name: "Metformin", price: 1.20 },
  { name: "Glibenclamide", price: 2.00 },
  { name: "Insulin (Human)", price: 35.00 },
  { name: "Insulin Pen", price: 45.00 },
  
  // Blood Pressure
  { name: "Amlodipine", price: 2.50 },
  { name: "Lisinopril", price: 1.80 },
  { name: "Losartan", price: 3.00 },
  { name: "Hydrochlorothiazide", price: 1.50 },
  { name: "Furosemide", price: 1.00 },
  
  // Cholesterol
  { name: "Atorvastatin", price: 4.50 },
  { name: "Simvastatin", price: 3.50 },
  { name: "Pravastatin", price: 5.00 },
  
  // Anticoagulants
  { name: "Warfarin", price: 2.00 },
  { name: "Heparin Injection", price: 15.00 },
  { name: "Clopidogrel", price: 8.00 },
  
  // Vitamins & Supplements
  { name: "Vitamin C", price: 0.80 },
  { name: "Vitamin D", price: 1.50 },
  { name: "Multivitamin", price: 2.00 },
  { name: "Zinc Supplements", price: 1.20 },
  { name: "Iron Supplements", price: 1.50 },
  { name: "Calcium + Vitamin D", price: 2.50 },
  { name: "Magnesium", price: 1.80 },
  
  // Cough & Cold
  { name: "Cough Syrup", price: 3.50 },
  { name: "Antihistamine", price: 1.20 },
  { name: "Decongestant Nasal Spray", price: 4.00 },
  { name: "Salbutamol Inhaler", price: 12.00 },
  
  // Other
  { name: "Probiotic", price: 3.00 },
  { name: "Laxative Tablet", price: 0.75 },
  { name: "Antiemetic", price: 2.20 },
];

export function filterMedicines(query: string): BasicMedicine[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return commonMedicines.filter(m => m.name.toLowerCase().includes(lowerQuery)).slice(0, 8);
}

export function getMedicinePrice(name: string): number {
  const medicine = commonMedicines.find(m => m.name.toLowerCase() === name.toLowerCase());
  return medicine?.price ?? 0;
}
