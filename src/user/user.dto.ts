import { Sex } from 'src/shared/enum/sex.enum';
import { RoleType } from '../shared/enum/role-type.enum';

export class UserDto {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly city: string;
  readonly phone: string;
  readonly avatar: string;
  readonly sex: Sex;
  readonly fullName?: string;
  readonly roles?: RoleType[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
