import { IsDecimal, IsPositive, IsString, MaxLength, MinDate, MinLength } from "class-validator";

export class CreateCreditCardDto {
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    readonly name: string;

    @IsDecimal()
    @IsPositive()
    readonly limit: number;

    // @IsMongoId
    // readonly mainCreditCard: mongoId
    
    // @IsMongoId
    // readonly userId: mongoId

    @MinDate(new Date())
    readonly nextClosingDate: Date;

    @MinDate(new Date())
    readonly nextExpiringDate: Date;
}
