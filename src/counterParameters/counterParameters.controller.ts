import {
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Scope,
  Controller,
  Delete,
  Put,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { counterParametersType } from 'src/shared/enum/counterParametersType';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeCounterParametersDto } from './changeCounterParameters.dto';
import { CounterParametersService } from './counterParameters.service';

@Controller({ path: 'counter-parameters', scope: Scope.REQUEST })
export class CounterParametersController {
  constructor(private counterParametersService: CounterParametersService) {}

  @Put(':type')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBannerParameters(
    @Param('type') type: counterParametersType,
    @Body() counterParameters: ChangeCounterParametersDto,
    @Res() res: any,
  ): Observable<any> {
    return this.counterParametersService.update(counterParameters, type).pipe(
      map(() => {
        return res
          .location('/counter-parameters/')
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
