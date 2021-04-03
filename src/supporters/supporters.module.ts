import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SupportersController } from './supporters.controller';
import { SupportersService } from './supporters.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SupportersController],
  providers: [SupportersService],
})
export class SupportersModule {}
