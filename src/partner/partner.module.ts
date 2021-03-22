import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
