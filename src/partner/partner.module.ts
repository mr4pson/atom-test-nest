import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrganiztaionTypeController } from './organiztaion-type.controller';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { OrganizationTypeService } from './organization-type.service';
// import { OrganizationTypeInitializerService } from './organization-type-initializer';

@Module({
  imports: [DatabaseModule],
  controllers: [PartnerController, OrganiztaionTypeController],
  providers: [
    PartnerService,
    OrganizationTypeService,
    // OrganizationTypeInitializerService,
  ],
})
export class PartnerModule {}
