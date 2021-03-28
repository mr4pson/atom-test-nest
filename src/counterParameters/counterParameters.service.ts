import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { CounterParameters } from 'src/database/counters-parameters.model';
import { COUNTER_PARAMETERS_MODEL } from 'src/database/database.constants';
import { counterParametersType } from 'src/shared/enum/counterParametersType';
import { ChangeCounterParametersDto } from './changeCounterParameters.dto';

@Injectable({ scope: Scope.REQUEST })
export class CounterParametersService {
  constructor(
    @Inject(COUNTER_PARAMETERS_MODEL)
    private counterParametersModel: Model<CounterParameters>,
  ) {}

  findByType(type: counterParametersType): Observable<CounterParameters> {
    return from(
      this.counterParametersModel.findOne({ type: type }).exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`counterParams:$id was not found`),
      ),
    );
  }

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
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`counterParams:$id was not found`),
      ),
    );
  }
}
