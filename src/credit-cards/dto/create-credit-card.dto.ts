import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinDate, MinLength } from "class-validator";

export class CreateCreditCardDto {
    @ApiProperty({example: 'My VISA', nullable: false})
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    readonly name: string;
    
    @ApiProperty({example: 500000, nullable: false})
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    readonly limit: number;
    
    @ApiProperty({ example: '660390c737f82a34d15cf791', uniqueItems: true })
    @IsMongoId()
    @IsOptional()
    readonly mainCreditCard?: string
    
    @ApiProperty({example: 'YYYY-MM-DD', nullable: false})
    @MinDate(new Date())
    @IsOptional()
    readonly nextClosingDate?: Date;
    
    @ApiProperty({example: 'YYYY-MM-DD', nullable: false})
    @MinDate(new Date())
    @IsOptional()
    readonly nextExpiringDate?: Date;
}
