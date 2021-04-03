import {
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Scope,
  Controller,
  Delete,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { DictationQuestion } from 'src/database/dictation-question.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeDictationQuestionDto } from './changeDictationQuestions.dto';
import { DictationQuestionsService } from './dictation-questions.service';

@ApiTags('questions')
@Controller({ path: 'dictation-questions', scope: Scope.REQUEST })
export class DictationQuestionsController {
  constructor(private dictationQuestionService: DictationQuestionsService) {}

  @Get('')
  getDictationQuestions(): Observable<any[]> {
    return this.dictationQuestionService.findAll();
  }

  @Get(':id')
  getDictationQuestionById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Observable<DictationQuestion> {
    return this.dictationQuestionService.findById(id);
  }

  @Post('')
  createDictationQuestion(
    @Body() dictationQuestion: ChangeDictationQuestionDto,
    @Res() res: any,
  ): Observable<DictationQuestion> {
    return this.dictationQuestionService.save(dictationQuestion).pipe(
      map((dictationQuestion) => {
        return res
          .location('/dictation-questions/' + dictationQuestion._id)
          .status(HttpStatus.CREATED)
          .send();
      }),
    );
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteDictationQuestion(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<DictationQuestion> {
    return this.dictationQuestionService.delete(id).pipe(
      map((dictationQuestion) => {
        return res
          .location('/dictation-questions/' + dictationQuestion._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
