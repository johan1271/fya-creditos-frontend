export interface Credit {
  id: number;
  customerName: string;
  idNumber: string;
  creditAmount: number;
  interestRate: number;
  termMonths: number;
  salesAgent: string;
  registeredAt: Date;
}
