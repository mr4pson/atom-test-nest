import {
  Body,
  Delete,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleType } from '../shared/enum/role-type.enum';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartnerService } from './partner.service';
import { ChangePartnerDto } from './changePartner.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Get } from '@nestjs/common';
import { Partner } from '../database/partner.model';
import { ParseObjectIdPipe } from '../shared/pipe/parse-object-id.pipe';

@Controller({ path: 'partners', scope: Scope.REQUEST })
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @Get('')
  getAllPartners(): Observable<Partner[]> {
    return this.partnerService.findAll();
  }

  @Get(':id')
  getPartnerById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Observable<Partner> {
    return this.partnerService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createPartner(
    @Body() news: ChangePartnerDto,
    @Res() res: any,
  ): Observable<any> {
    return this.partnerService.save(news).pipe(
      map((partner) => {
        return res
          .location('/partners/' + partner._id)
          .status(HttpStatus.CREATED)
          .send();
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updatePartner(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() partner: ChangePartnerDto,
    @Res() res: any,
  ): Observable<Response> {
    return this.partnerService.update(id, partner).pipe(
      map((partner) => {
        return res
          .location('/partners/' + partner._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  deletePartnerById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Response> {
    return this.partnerService.deleteById(id).pipe(
      map(() => {
        return res.status(HttpStatus.NO_CONTENT).send();
      }),
    );
  }
}
