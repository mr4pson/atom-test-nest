import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { OrganizationType } from 'src/database/organization-type.model';
import { ORGANIZATION_TYPE_MODEL } from '../database/database.constants';

@Injectable()
export class OrganizationTypeInitializerService implements OnModuleInit {
  constructor(
    @Inject(ORGANIZATION_TYPE_MODEL)
    private organizationTypeModel: Model<OrganizationType>,
  ) {}

  async onModuleInit(): Promise<void> {
    console.log('(PartnerModule) is initialized...');
    await this.organizationTypeModel.deleteMany({});
    const radio = {
      title: 'Радио',
    };

    const magazin = {
      title: 'Газета',
    };

    const tv = {
      title: 'Телевидение',
    };

    const defaultType = {
      title: 'Без рубрики',
    };

    await Promise.all([
      this.organizationTypeModel.create(radio),
      this.organizationTypeModel.create(magazin),
      this.organizationTypeModel.create(tv),
      this.organizationTypeModel.create(defaultType),
    ]).then((data) => console.log(data));
  }
}
