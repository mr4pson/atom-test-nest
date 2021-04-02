import { Controller, Get, Scope } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { OrganizationType } from 'src/database/organization-type.model';
import { OrganizationTypeService } from './organization-type.service';

@ApiTags('organizationTypes')
@Controller({ path: 'organization-types', scope: Scope.REQUEST })
export class OrganiztaionTypeController {
  constructor(private organizationTypeService: OrganizationTypeService) {}

  @Get('')
  getAllOrganizationType(): Observable<OrganizationType[]> {
    return this.organizationTypeService.findAll();
  }
}
