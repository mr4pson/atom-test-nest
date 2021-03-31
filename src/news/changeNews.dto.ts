import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Subcategory } from 'src/database/subcategory.model';

export class ChangeNewsDto {
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
  readonly heading: string;

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
  readonly subcategory: Subcategory;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly status: string;
}
