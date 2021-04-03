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
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Suppoter } from 'src/database/supporter.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { ChangeSupporterDto } from './changeSupporter.dto';
import { SupportersService } from './supporters.service';

@ApiTags('supporters')
@Controller({ path: 'supporters', scope: Scope.REQUEST })
export class SupportersController {
  constructor(private supporterService: SupportersService) {}

  @Get('')
  getNews(): Observable<Suppoter[]> {
    return this.supporterService.findAll();
  }

  @Get(':id')
  getFaqById(@Param('id', ParseObjectIdPipe) id: string): Observable<Suppoter> {
    return this.supporterService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createSupporter(
    @Body() supporter: ChangeSupporterDto,
    @Res() res: any,
  ): Observable<Suppoter> {
    return this.supporterService.save(supporter).pipe(
      map((supporter) => {
        return res
          .location('/supporters/' + supporter._id)
          .status(HttpStatus.CREATED)
          .send();
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateSupporter(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() supporter: ChangeSupporterDto,
    @Res() res: any,
  ): Observable<Suppoter> {
    return this.supporterService.update(id, supporter).pipe(
      map((supporter) => {
        return res
          .location('/supporters/' + supporter._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteSupporter(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Suppoter> {
    return this.supporterService.delete(id).pipe(
      map((supporter) => {
        return res
          .location('/supporters/' + supporter._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
