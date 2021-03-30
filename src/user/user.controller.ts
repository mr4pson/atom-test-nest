import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '../database/user.model';
import { Observable } from 'rxjs';
import { ParseObjectIdPipe } from '../shared/pipe/parse-object-id.pipe';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { map } from 'rxjs/operators';

@ApiTags('users')
@Controller({ path: '/users' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  getUsers(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('withPosts', new DefaultValuePipe(false)) withPosts?: boolean,
  ): Observable<Partial<User>> {
    return this.userService.findById(id, withPosts);
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<any> {
    return this.userService.delete(id).pipe(
      map((user) => {
        return res
          .location('/news/' + user._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
