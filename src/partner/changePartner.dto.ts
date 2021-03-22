import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePartnerDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly title: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly link: string;

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
    type: Boolean,
    required: true,
  })
  readonly visible: boolean;
}
