import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Menu } from 'src/database/menu.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { ChangeMenuDto } from './change-menu.dto';
import { MenuService } from './menu.service';

@ApiTags('menus')
@Controller({ path: 'menus', scope: Scope.REQUEST })
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('')
  getAllMenus(): Observable<Menu[]> {
    return this.menuService.findAll();
  }

  @Get('get-visible-menus')
  getAllVisibleMenus(): Observable<Menu[]> {
    return this.menuService.findAllVisible();
  }

  @Get(':id')
  getMenuById(@Param('id', ParseObjectIdPipe) id: string): Observable<Menu> {
    return this.menuService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createMenu(@Body() menu: ChangeMenuDto, @Res() res: any): Observable<any> {
    return this.menuService.save(menu).pipe(
      map((menu) => {
        return res
          .location('/menus/' + menu._id)
          .status(HttpStatus.CREATED)
          .json(menu);
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateMenu(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() menu: ChangeMenuDto,
    @Res() res: any,
  ): Observable<Response> {
    return this.menuService.update(id, menu).pipe(
      switchMap(() => {
        return this.menuService.findAll();
      }),
      map((menus) => {
        return res.status(HttpStatus.OK).json(menus);
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  deleteMenuById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Menu[]> {
    return this.menuService.deleteById(id).pipe(
      switchMap(() => {
        return this.menuService.findAll();
      }),
      map((menus) => {
        return res.status(HttpStatus.OK).json(menus);
      }),
    );
  }
}
