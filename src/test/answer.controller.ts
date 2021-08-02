import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Render,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { Answer } from 'src/database/answer.model';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AnswerDto } from './answer.dto';
import { AnswerService } from './answer.service';

@ApiTags('answers')
@Controller({ path: 'answers', scope: Scope.REQUEST })
export class AnswerController {
  constructor(
    private answerService: AnswerService,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getAnswersByUserId(): Observable<Answer[]> {
    return this.answerService.findByUserId(this.req.user.id);
  }

  @Get('/share-diploma/:id')
  @Render('index.hbs')
  async shareDiploma(@Param('id', ParseObjectIdPipe) id: string) {
    const answers = await this.answerService.findByUserId(id).toPromise();
    const answer = answers[0] as any;
    return {
      author: answer?.author.fullName,
      percentage: answer.percentage,
    };
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  saveAnswers(
    @Body() answer: AnswerDto,
    @Res() res: any,
  ): Observable<Response> {
    return this.answerService.save(answer).pipe(
      map((answer) => {
        return res
          .location('/answers/' + answer._id)
          .status(201)
          .send();
      }),
    );
  }
}
