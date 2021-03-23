import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { CounterParameters } from 'src/database/counters-parameters.model';
import { COUNTER_PARAMETERS_MODEL } from 'src/database/database.constants';
import { counterParametersType } from 'src/shared/enum/counterParametersType';
import { ChangeCounterParametersDto } from './changeCounterParameters.dto';

@Injectable({ scope: Scope.REQUEST })
export class CounterParametersService {
  constructor(
    @Inject(COUNTER_PARAMETERS_MODEL)
    private counterParametersModel: Model<CounterParameters>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  update(
    data: ChangeCounterParametersDto,
    type: counterParametersType,
  ): Observable<
    CounterParameters | { ok: number; n: number; nModified: number }
  > {
    return from(
      this.counterParametersModel
        .findOneAndUpdate({ type }, { ...data })
        .exec(),
    ).pipe(throwIfEmpty(() => new NotFoundException(`news:$id was not found`)));
  }
}
