import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { Partner } from '../database/partner.model';
import { AuthenticatedRequest } from '../auth/interface/authenticated-request.interface';
import { EMPTY, from, Observable, of } from 'rxjs';
import { ChangePartnerDto } from './changePartner.dto';
import { PARTNER_MODEL } from 'src/database/database.constants';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';

@Injectable()
export class PartnerService {
  constructor(
    @Inject(PARTNER_MODEL) private partnerModel: Model<Partner>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<Partner[]> {
    return from(this.partnerModel.find().exec());
  }

  findById(id: string): Observable<Partner> {
    return from(this.partnerModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`partner:$id was not found`)),
    );
  }

  save(data: ChangePartnerDto): Observable<Partner> {
    const createQuestion: Promise<Partner> = this.partnerModel.create({
      ...data,
    });
    return from(createQuestion);
  }

  update(id: string, data: ChangePartnerDto): Observable<any> {
    return from(
      this.partnerModel
        .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        .exec(),
    ).pipe(
      throwIfEmpty(() => new NotFoundException(`partner:$id was not found`)),
    );
  }

  deleteById(id: string): Observable<Partner> {
    return from(this.partnerModel.findByIdAndRemove(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`partner:$id was not found`)),
    );
  }
}
