import { Inject, Param } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { Answer } from 'src/database/answer.model';
import { ANSWER_MODEL } from 'src/database/database.constants';
import { AnswerDto } from './answer.dto';

@Injectable({ scope: Scope.REQUEST })
export class AnswerService {
  constructor(
    @Inject(ANSWER_MODEL) private answerModel: Model<Answer>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findByUserId(id): Observable<Answer[]> {
    return from(
      this.answerModel.find({ author: id }).populate('author').exec(),
    );
  }

  save(data: AnswerDto): Observable<Answer> {
    const createAnswer: Promise<Answer> = this.answerModel.create({
      ...data,
      author: { _id: this.req.user.id },
      version: 1,
    });
    return from(createAnswer);
  }
}
