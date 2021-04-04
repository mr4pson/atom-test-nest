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
import { Subcategory } from 'src/database/subcategory.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { ChangeSubcategoryDto } from './change-subcategory.dto';
import { MenuService } from './menu.service';
import { SubcategoryService } from './subcategory.service';

@ApiTags('subcategories')
@Controller({ path: 'subcategories', scope: Scope.REQUEST })
export class SubcategoryController {
  constructor(
    private subcategoryService: SubcategoryService,
    private menuService: MenuService,
  ) {}

  @Get('')
  getAllMenus(): Observable<Subcategory[]> {
    return this.subcategoryService.findAll();
  }

  @Get('byLink/:link')
  getSubcatrgoryByLink(@Param('link') link: string): Observable<Subcategory> {
    return this.subcategoryService.findByLink(link);
  }

  @Get(':id')
  getMenuById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Observable<Subcategory> {
    return this.subcategoryService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createSubcategory(
    @Body() subcategory: ChangeSubcategoryDto,
    @Res() res: any,
  ): Observable<any> {
    let subcategoryId;
    return this.subcategoryService.save(subcategory).pipe(
      switchMap((subcategory) => {
        subcategoryId = subcategory._id;
        return this.menuService.findById(subcategory.menu);
      }),
      switchMap((menu) => {
        return this.menuService.update(menu.id, {
          title: menu.title,
          url: menu.url,
          visible: menu.visible,
          editable: menu.editable,
          deletable: menu.deletable,
          subcategories: menu.subcategories
            .map((subcategory) => subcategory)
            .concat([subcategoryId]),
        });
      }),
      map((menu) => {
        return res.status(HttpStatus.CREATED).json(menu);
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateSubcategory(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() subcategory: ChangeSubcategoryDto,
    @Res() res: any,
  ): Observable<Response> {
    return this.subcategoryService.update(id, subcategory).pipe(
      switchMap(() => {
        return this.subcategoryService.findAll();
      }),
      map((subcategories) => {
        return res.status(HttpStatus.OK).json(subcategories);
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  deleteMenuById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Subcategory[]> {
    return this.subcategoryService.deleteById(id).pipe(
      switchMap(() => {
        return this.subcategoryService.findAll();
      }),
      map((subcategories) => {
        return res.status(HttpStatus.OK).json(subcategories);
      }),
    );
  }
}
