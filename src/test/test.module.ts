import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionOptionService } from './questionOption.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AnswerController, QuestionController],
  providers: [AnswerService, QuestionService, QuestionOptionService],
})
export class TestModule {}
