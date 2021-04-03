import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { SUPPORTER_MODEL } from 'src/database/database.constants';
import { Suppoter } from 'src/database/supporter.model';
import { ChangeSupporterDto } from './changeSupporter.dto';

@Injectable()
export class SupportersService {
  constructor(
    @Inject(SUPPORTER_MODEL) private supporterModel: Model<Suppoter>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<Suppoter[]> {
    return from(this.supporterModel.find().exec());
  }

  findById(id: string): Observable<Suppoter> {
    return from(this.supporterModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`faq:$id was not found`)),
    );
  }

  save(data: ChangeSupporterDto): Observable<Suppoter> {
    const createSupporter: Promise<Suppoter> = this.supporterModel.create({
      ...data,
    });
    return from(createSupporter);
  }

  update(id: string, data: ChangeSupporterDto): Observable<Suppoter> {
    return from(
      this.supporterModel.findOneAndUpdate({ _id: id }, { ...data }).exec(),
    ).pipe(
      throwIfEmpty(() => new NotFoundException(`supporter:$id was not found`)),
    );
  }

  delete(id: string): Observable<Suppoter> {
    return from(this.supporterModel.findByIdAndDelete(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`supporter:$id was not found`)),
    );
  }
}
