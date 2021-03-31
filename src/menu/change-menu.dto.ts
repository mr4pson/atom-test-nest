import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeMenuDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  readonly url: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  readonly visible: boolean;

  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  readonly editable: boolean;

  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  readonly deletable: boolean;
}
