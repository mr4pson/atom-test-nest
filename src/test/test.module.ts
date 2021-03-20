import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class TestModule {}
