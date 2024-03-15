export class CreateCreditCardDto {
    name: string;
    limit: number;
    // mainCreditCard: mongoId
    // userId: mongoId
    nextClosingDate: Date;
    nextExpiringDate: Date;
}
