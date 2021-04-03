import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DictationQuestionsController } from './dictation-questions.conroller';
import { DictationQuestionsService } from './dictation-questions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DictationQuestionsController],
  providers: [DictationQuestionsService],
})
export class DictationQuestionsModule {}
