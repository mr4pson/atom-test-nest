import {
  Get,
  Body,
  Res,
  UseGuards,
  Scope,
  Controller,
  Put,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from '../auth/guard/has-roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { counterParametersType } from '../shared/enum/counterParametersType';
import { RoleType } from '../shared/enum/role-type.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeCounterParametersDto } from './changeCounterParameters.dto';
import { CounterParametersService } from './counterParameters.service';

@ApiTags('counter-parameters')
@Controller({ path: 'counter-parameters', scope: Scope.REQUEST })
export class CounterParametersController {
  constructor(private counterParametersService: CounterParametersService) {}
  @Get(':type')
  getBannerParameters(
    @Param('type') type: counterParametersType,
  ): Observable<any> {
    return this.counterParametersService.findByType(type);
  }

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
