import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { counterParametersType } from 'src/shared/enum/counterParametersType';

export class ChangeCounterParametersDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly data: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  readonly type: counterParametersType;
}
