import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly createdDate: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly heading: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly uploadFile: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly description: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly status: string;
}