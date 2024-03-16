export class CreateExpenseDto {
  title: string;
  ccName: string;
  acquiredAt: Date;
  // creditCardId: mongoId
  type: 'subscription' | 'purchase';
  amount: number;
  installments: number;
  isActive: boolean; // true by default
}
