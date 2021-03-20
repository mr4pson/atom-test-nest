import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly answers: string;
}
