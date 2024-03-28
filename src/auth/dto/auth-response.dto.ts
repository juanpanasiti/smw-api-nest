import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'iamacooluser', uniqueItems: true })
  readonly username: string;

  @ApiProperty({ example: '660390c737f82a34d15cf791', uniqueItems: true })
  readonly id: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0.eyJ1c2VySWQiOiI2NjbzOTBiNzM3ZTgyYTMzZDE1YmY3OTEiLCJpYXQiOjE3MTE2NTMwNDYsImV4cCI6MTcxMTczOTQ0Nn0.uvfkVB121njpPZzVWMrGrjbE_6llYRd4w-u-FFM5zzk',
    uniqueItems: true,
  })
  readonly token: string;
}
