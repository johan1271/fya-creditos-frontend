import { Credit } from '../models/credit.model';
import { CreditResponseDto } from '../models/credit-dto.model';

// Standard French amortization formula: a fixed monthly payment that fully
// pays off the principal (with interest) over the term. interestRate is a
// monthly percentage (e.g. 2.5 means 2.5%/month), matching the register form.
function calculateMonthlyPayment(creditAmount: number, interestRate: number, termMonths: number): number {
  const monthlyRate = interestRate / 100;
  if (monthlyRate === 0) {
    return creditAmount / termMonths;
  }
  return (creditAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
}

export function toCredit(dto: CreditResponseDto): Credit {
  return {
    id: dto.id,
    customerName: dto.customerName,
    idNumber: dto.idNumber,
    creditAmount: dto.creditAmount,
    interestRate: dto.interestRate,
    termMonths: dto.termMonths,
    salesAgent: dto.salesAgent,
    registeredAt: new Date(dto.registeredAt),
    monthlyPayment: calculateMonthlyPayment(dto.creditAmount, dto.interestRate, dto.termMonths),
  };
}

export function toCreditList(dtos: CreditResponseDto[]): Credit[] {
  return dtos.map(toCredit);
}
