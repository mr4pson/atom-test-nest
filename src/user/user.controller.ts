import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
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
import { UserDto } from './user.dto';

@ApiTags('users')
@Controller({ path: '/users' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  getUsers(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get('getByName')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUserByName2(): Observable<Partial<User[]>> {
    return this.userService.findAll();
  }

  @Get('getByName/:name')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUserByName(@Param('name') name: string): Observable<Partial<User[]>> {
    return this.userService.findByName(name);
  }

  @Get(':id')
  getUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('withPosts', new DefaultValuePipe(false)) withPosts?: boolean,
  ): Observable<Partial<User>> {
    return this.userService.findById(id, withPosts);
  }

  @Put(':id')
  @HasRoles(RoleType.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() user: UserDto,
    @Res() res: any,
  ): Observable<any> {
    return this.userService.update(id, user).pipe(
      map((user) => {
        return res
          .location('/users/' + user._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
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
          .location('/users/' + user._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
