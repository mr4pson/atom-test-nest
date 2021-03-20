import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sex } from 'src/shared/enum/sex.enum';
export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    required: true,
  })
  //@Matches(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: ' The min length of password is 8 ' })
  @MaxLength(20, {
    message: " The password can't accept more than 20 characters ",
  })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one supercase char and one lowercase char" }
  // )
  @ApiProperty({
    type: String,
    minLength: 8,
    maxLength: 20,
    required: true,
  })
  readonly password: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly fullName?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly city: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly sex: Sex;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  readonly phone: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: false,
  })
  readonly avatar: string;
}
