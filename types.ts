
export type Currency = 'EUR' | 'USD' | 'GBP' | 'EGP' | 'AED' | 'SAR' | 'TRY';

export interface QuizAnswers {
  usage: string[]; // Q1
  chargeAdmission: 'Yes' | 'No' | ''; // Q2
  admissionFee: number; // Q3
  currency: Currency | string; // Q3
  annualVisitors: number; // Q4
  products: string[]; // Q5
  deviceCounts: Record<string, number>; // Quantities for selected products
  dashboardUsers: number; // New: Dashboard access count
  languages: string[]; // Q6
  pointsOfInterest: string; // Q7
  updateFrequency: string; // Q8
  wifiStable: 'Yes' | 'No' | ''; // Q9
  powerStable: 'Yes' | 'No' | ''; // New
  objectives: string[]; // Q10
  commercialStructure: string; // Q11
}

export interface QuizStepProps {
  answers: QuizAnswers;
  updateAnswers: (updates: Partial<QuizAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}
