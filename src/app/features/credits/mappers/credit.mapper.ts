import { Credit } from '../models/credit.model';
import { CreditResponseDto } from '../models/credit-dto.model';

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
  };
}

export function toCreditList(dtos: CreditResponseDto[]): Credit[] {
  return dtos.map(toCredit);
}
