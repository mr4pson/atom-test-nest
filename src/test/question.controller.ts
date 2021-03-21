import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  @Post('')
  @UseGuards(JwtAuthGuard)
  updateQuestions(
    @Body() questions: ChangeQuestionDto[],
    @Res() res: any,
  ): Observable<any> {
    return this.questionService.findAll().pipe(
      switchMap((oldQuestions) => {
        const questionObservables = [];
        const redundantQuestions = oldQuestions.filter((oldQuestion) => {
          return !questions
            .map((question) => JSON.stringify(question._id))
            .includes(JSON.stringify(oldQuestion._id));
        });
        redundantQuestions.forEach((question) => {
          const questionObservable = this.questionService.deleteById(
            question._id,
          );
          questionObservables.push(questionObservable);
        });
        let questionId;
        const changeObservables = [];
        questions.forEach((question) => {
          const options = question.options;
          const questionObservable = of(question).pipe(
            switchMap((question) => {
              if (question._id) {
                return this.questionService.update(question._id, {
                  ...question,
                  options: [],
                });
              }
              return this.questionService.save({
                ...question,
                options: [],
              });
            }),
            switchMap((updatedQuestion) => {
              questionId = updatedQuestion._id;
              const removeObservables = [];
              const curOldQuestion = oldQuestions.find(
                (oldQuestion) =>
                  JSON.stringify(oldQuestion._id) ===
                  JSON.stringify(question._id),
              );
              if (curOldQuestion) {
                const redundantQuestionOptions = curOldQuestion.options.filter(
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
          questionObservables.push(questionObservable);
        });
        return forkJoin(questionObservables);
      }),
      map(() => {
        return res.status(201).send();
      }),
    );
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getQuestions() {
    return this.questionService.findAll();
  }
}
