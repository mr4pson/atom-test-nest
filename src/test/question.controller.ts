import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Question } from 'src/database/question.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeQuestionDto } from './changeQuestion.dto';
import { QuestionService } from './question.service';
import { QuestionOptionService } from './questionOption.service';

@Controller({ path: 'questions', scope: Scope.REQUEST })
export class QuestionController {
  constructor(
    private questionService: QuestionService,
    private questionOptionService: QuestionOptionService,
  ) {}
  @Get('')
  @UseGuards(JwtAuthGuard)
  getQuestions() {
    return this.questionService.findAll();
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  createQuestion(
    @Body() question: ChangeQuestionDto,
    @Res() res: any,
  ): Observable<any> {
    let questionId;
    const changeObservables = [];
    const options = question.options;
    return of(question).pipe(
      switchMap((question) => {
        return this.questionService.save({
          ...question,
          options: [],
        });
      }),
      switchMap((updatedQuestion) => {
        questionId = updatedQuestion._id;
        options.forEach((option) => {
          changeObservables.push(
            this.questionOptionService.save({
              question: { _id: questionId },
              title: option.title,
              image: option.image,
              trueOption: option.trueOption,
            }),
          );
        });
        return changeObservables.length ? forkJoin(changeObservables) : of([]);
      }),
      switchMap((options: any[]) => {
        const optionsIds = options
          .filter((option) => option?._id)
          .map((option) => option._id);
        return this.questionService.update(questionId, {
          ...question,
          options: optionsIds,
        });
      }),
      switchMap(() => {
        return this.questionService.findAll();
      }),
      map((questions) => {
        return res.status(HttpStatus.CREATED).json(questions).send();
      }),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  updateQuestion(
    @Param('id') id: string,
    @Body() question: ChangeQuestionDto,
    @Res() res: any,
  ): Observable<any> {
    return this.questionService.find(id).pipe(
      switchMap((oldQuestion) => {
        let questionId;
        const changeObservables = [];
        const options = question.options;
        const questionObservable = of(question).pipe(
          switchMap((question) => {
            return this.questionService.update(question._id, {
              ...question,
              options: [],
            });
          }),
          switchMap((updatedQuestion) => {
            questionId = updatedQuestion._id;
            const removeObservables = [];
            if (oldQuestion) {
              const redundantQuestionOptions = oldQuestion.options.filter(
                (oldQuestionOptionId) => {
                  return !options
                    .map((option) => JSON.stringify(option._id))
                    .includes(JSON.stringify(oldQuestionOptionId));
                },
              );
              redundantQuestionOptions.forEach((redundantQuestionOption) => {
                const questionOptionObservable = of(
                  redundantQuestionOption,
                ).pipe(
                  switchMap((redundantQuestionOptionId) => {
                    return this.questionOptionService.deleteById(
                      redundantQuestionOptionId,
                    );
                  }),
                );
                removeObservables.push(questionOptionObservable);
              });
            }
            options.forEach((option) => {
              if (option._id) {
                changeObservables.push(
                  this.questionOptionService.update(option._id, {
                    question: { _id: questionId },
                    title: option.title,
                    image: option.image,
                    trueOption: option.trueOption,
                  }),
                );
              } else {
                changeObservables.push(
                  this.questionOptionService.save({
                    question: { _id: questionId },
                    title: option.title,
                    image: option.image,
                    trueOption: option.trueOption,
                  }),
                );
              }
            });
            return removeObservables.length
              ? forkJoin(removeObservables)
              : of([]);
          }),
          switchMap(() => {
            return changeObservables.length
              ? forkJoin(changeObservables)
              : of([]);
          }),
          switchMap((options: any[]) => {
            const optionsIds = options
              .filter((option) => option?._id)
              .map((option) => option._id);
            return this.questionService.update(questionId, {
              ...question,
              options: optionsIds,
            });
          }),
        );
        return questionObservable;
      }),
      map(() => {
        return res.status(HttpStatus.OK).send();
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(RoleType.ADMIN)
  deleteQuestionById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<Question[]> {
    return this.questionService.deleteById(id).pipe(
      switchMap(() => {
        return this.questionService.findAll();
      }),
      map((questions) => {
        return res.status(HttpStatus.OK).json(questions);
      }),
    );
  }
}
