import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}