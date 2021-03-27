import { Delete, Get, Param } from '@nestjs/common';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Faq } from 'src/database/faq.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { ChangeFaqDto } from './changeFaq.dto';
import { FaqService } from './faq.service';

@Controller({ path: 'faqs', scope: Scope.REQUEST })
export class FaqController {
  constructor(private faqService: FaqService) {}
  @Get('')
  getAllFaqs(): Observable<Faq[]> {
    return this.faqService.findAll();
  }

  @Get(':id')
  getFaqById(@Param('id', ParseObjectIdPipe) id: string): Observable<Faq> {
    return this.faqService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createFaq(@Body() faq: ChangeFaqDto, @Res() res: any): Observable<any> {
    return this.faqService.save(faq).pipe(
      map((faq) => {
        return res
          .location('/faqs/' + faq._id)
          .status(HttpStatus.CREATED)
          .json(faq);
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateFaq(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() faq: ChangeFaqDto,
    @Res() res: any,
  ): Observable<Response> {
    return this.faqService.update(id, faq).pipe(
      map((faq) => {
        return res
          .location('/faqs/' + faq._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  deleteFaqById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Faq[]> {
    return this.faqService.deleteById(id).pipe(
      switchMap(() => {
        return this.faqService.findAll();
      }),
      map((faqs) => {
        return res.status(HttpStatus.OK).json(faqs);
      }),
    );
  }
}
