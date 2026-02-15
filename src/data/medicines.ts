// Medicine database with prices (in GHC)
export type BasicMedicine = { name: string; price: number };

export const commonMedicines: BasicMedicine[] = [
  // Painkillers
  { name: "Paracetamol 500mg", price: 0.50 },
  { name: "Ibuprofen 200mg", price: 0.75 },
  { name: "Aspirin 300mg", price: 0.40 },
  { name: "Diclofenac 50mg", price: 1.20 },
  
  // Antibiotics
  { name: "Amoxicillin 500mg", price: 2.50 },
  { name: "Azithromycin 500mg", price: 3.50 },
  { name: "Ciprofloxacin 500mg", price: 2.00 },
  { name: "Tetracycline 500mg", price: 1.80 },
  
  // Antacids & Digestives
  { name: "Omeprazole 20mg", price: 1.50 },
  { name: "Ranitidine 150mg", price: 1.00 },
  { name: "Antacid Liquid", price: 4.50 },
  { name: "Metoclopramide 10mg", price: 0.60 },
  
  // Diabetes
  { name: "Metformin 500mg", price: 1.20 },
  { name: "Glibenclamide 5mg", price: 2.00 },
  { name: "Insulin (Human)", price: 35.00 },
  { name: "Insulin Pen", price: 45.00 },
  
  // Blood Pressure
  { name: "Amlodipine 5mg", price: 2.50 },
  { name: "Lisinopril 10mg", price: 1.80 },
  { name: "Losartan 50mg", price: 3.00 },
  { name: "Hydrochlorothiazide 25mg", price: 1.50 },
  { name: "Furosemide 40mg", price: 1.00 },
  
  // Cholesterol
  { name: "Atorvastatin 20mg", price: 4.50 },
  { name: "Simvastatin 20mg", price: 3.50 },
  { name: "Pravastatin 40mg", price: 5.00 },
  
  // Anticoagulants
  { name: "Warfarin 5mg", price: 2.00 },
  { name: "Heparin Injection", price: 15.00 },
  { name: "Clopidogrel 75mg", price: 8.00 },
  
  // Vitamins & Supplements
  { name: "Vitamin C 500mg", price: 0.80 },
  { name: "Vitamin D 1000IU", price: 1.50 },
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
  { name: "Antiemetic 5mg", price: 2.20 },
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
