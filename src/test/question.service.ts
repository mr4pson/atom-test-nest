import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { QUESTION_MODEL } from 'src/database/database.constants';
import { Question } from 'src/database/question.model';
import { ChangeQuestionDto } from './changeQuestion.dto';
import { UpdateQuestionDto } from './updateQuestion.dto';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(QUESTION_MODEL) private questionModel: Model<Question>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}
  findAll(): Observable<Question[]> {
    return from(this.questionModel.find().populate('options').exec());
  }

  save(data: ChangeQuestionDto): Observable<Question> {
    const createQuestion: Promise<Question> = this.questionModel.create({
      ...data,
    });
    return from(createQuestion);
  }
  update(id: string, data: UpdateQuestionDto): Observable<Question> {
    return from(
      this.questionModel.findOneAndUpdate({ _id: id }, { ...data }).exec(),
    ).pipe(
      throwIfEmpty(() => new NotFoundException(`question:$id was not found`)),
    );
  }

  deleteById(id: string): Observable<Question> {
    return from(this.questionModel.findByIdAndRemove(id).exec()).pipe(
      // mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`question:$id was not found`)),
    );
  }
}
