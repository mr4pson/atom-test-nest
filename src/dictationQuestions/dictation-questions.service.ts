import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { DICTATION_QUESTION_MODEL } from 'src/database/database.constants';
import { DictationQuestion } from 'src/database/dictation-question.model';
import { ChangeDictationQuestionDto } from './changeDictationQuestions.dto';

@Injectable({ scope: Scope.REQUEST })
export class DictationQuestionsService {
  constructor(
    @Inject(DICTATION_QUESTION_MODEL)
    private dictationQuestionModel: Model<DictationQuestion>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<DictationQuestion[]> {
    return from(this.dictationQuestionModel.find().exec());
  }

  findById(id: string): Observable<DictationQuestion> {
    return from(this.dictationQuestionModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`dictationQuestion:$id was not found`),
      ),
    );
  }

  save(data: ChangeDictationQuestionDto): Observable<DictationQuestion> {
    const createDictationQuestion: Promise<DictationQuestion> = this.dictationQuestionModel.create(
      {
        ...data,
      },
    );
    return from(createDictationQuestion);
  }

  delete(id: string): Observable<DictationQuestion> {
    return from(this.dictationQuestionModel.findByIdAndDelete(id).exec()).pipe(
      throwIfEmpty(
        () => new NotFoundException(`dictationQuestion:$id was not found`),
      ),
    );
  }
}
