import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { FAQ_MODEL } from 'src/database/database.constants';
import { Faq } from 'src/database/faq.model';
import { ChangeFaqDto } from './changeFaq.dto';

@Injectable()
export class FaqService {
  constructor(
    @Inject(FAQ_MODEL) private faqModel: Model<Faq>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<Faq[]> {
    return from(this.faqModel.find().exec());
  }

  findById(id: string): Observable<Faq> {
    return from(this.faqModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`faq:$id was not found`)),
    );
  }

  save(data: ChangeFaqDto): Observable<Faq> {
    const createQuestion: Promise<Faq> = this.faqModel.create({
      ...data,
    });
    return from(createQuestion);
  }

  update(id: string, data: ChangeFaqDto): Observable<any> {
    return from(
      this.faqModel
        .findOneAndUpdate({ _id: id }, { ...data } as any, { new: true })
        .exec(),
    ).pipe(throwIfEmpty(() => new NotFoundException(`faq:$id was not found`)));
  }

  deleteById(id: string): Observable<Faq> {
    return from(this.faqModel.findByIdAndRemove(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`faq:$id was not found`)),
    );
  }
}
