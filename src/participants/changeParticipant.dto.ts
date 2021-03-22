import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeParticipantDto {
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
  readonly city: string;

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
  readonly number: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  readonly visible: boolean;
}
