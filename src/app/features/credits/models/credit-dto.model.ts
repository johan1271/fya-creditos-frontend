export interface CreditRequestDto {
  customerName: string;
  idNumber: string;
  creditAmount: number;
  interestRate: number;
  termMonths: number;
  salesAgent: string;
}

export interface CreditResponseDto {
  id: number;
  customerName: string;
  idNumber: string;
  creditAmount: number;
  interestRate: number;
  termMonths: number;
  salesAgent: string;
  registeredAt: string;
}

export interface PagedResponseDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
