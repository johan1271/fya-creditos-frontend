export interface Credit {
  id: number;
  customerName: string;
  idNumber: string;
  creditAmount: number;
  interestRate: number;
  termMonths: number;
  salesAgent: string;
  registeredAt: Date;
  /** Computed client-side (French amortization) — not stored by the backend. */
  monthlyPayment: number;
}
