import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
