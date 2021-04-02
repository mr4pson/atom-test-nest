import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { ORGANIZATION_TYPE_MODEL } from 'src/database/database.constants';
import { OrganizationType } from 'src/database/organization-type.model';

@Injectable()
export class OrganizationTypeService {
  constructor(
    @Inject(ORGANIZATION_TYPE_MODEL)
    private organizationTypeModel: Model<OrganizationType>,
  ) {}

  findAll(): Observable<OrganizationType[]> {
    return from(this.organizationTypeModel.find().exec());
  }
}
