import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { QUESTION_OPTION_MODEL } from 'src/database/database.constants';
import { QuestionOption } from 'src/database/questionOption.model';
import { CreateQuestionOptionDto } from './createQuestionOption.dto';
import { UpdateQuestionOptionDto } from './updateQuestionOption.dto';

@Injectable()
export class QuestionOptionService {
  constructor(
    @Inject(QUESTION_OPTION_MODEL)
    private questionOptionModel: Model<QuestionOption>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}
  save(data: CreateQuestionOptionDto): Observable<QuestionOption> {
    const createQuestionOption: Promise<QuestionOption> = this.questionOptionModel.create(
      {
        ...data,
      },
    );
    return from(createQuestionOption);
  }

  update(
    id: string,
    data: UpdateQuestionOptionDto,
  ): Observable<QuestionOption> {
    return from(
      this.questionOptionModel
        .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        .exec(),
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`questionOption:$id was not found`),
      ),
    );
  }

  deleteById(id: string): Observable<QuestionOption> {
    return from(
      this.questionOptionModel.findOneAndDelete({ _id: id }).exec(),
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`questionOption:$id was not found`),
      ),
    );
  }
}
