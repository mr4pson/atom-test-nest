import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Answer } from 'src/database/answer.model';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AnswerDto } from './answer.dto';
import { AnswerService } from './answer.service';

@ApiTags('answers')
@Controller({ path: 'answers', scope: Scope.REQUEST })
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getAnswersByUserId(): Observable<Answer[]> {
    return this.answerService.findByUserId();
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  getProfile(@Body() answer: AnswerDto, @Res() res: any): Observable<Response> {
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
