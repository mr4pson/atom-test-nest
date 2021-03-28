import {
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Scope,
  Controller,
  Delete,
  Put,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeParticipantDto } from './changeParticipant.dto';
import { ParticipantsService } from './participants.service';

@ApiTags('participants')
@Controller({ path: 'participants', scope: Scope.REQUEST })
export class ParticipantsController {
  constructor(private participantsService: ParticipantsService) {}

  @Get('')
  getParticipants(): Observable<any[]> {
    return this.participantsService.findAll();
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createParticipant(
    @Body() participant: ChangeParticipantDto,
    @Res() res: any,
  ): Observable<any> {
    return this.participantsService.save(participant).pipe(
      map((participant) => {
        return res
          .location('/participants/' + participant._id)
          .status(HttpStatus.CREATED)
          .send();
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateParticipant(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() participant: ChangeParticipantDto,
    @Res() res: any,
  ): Observable<any> {
    return this.participantsService.update(id, participant).pipe(
      map((participant) => {
        return res
          .location('/participants/' + participant._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteParticipant(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<any> {
    return this.participantsService.delete(id).pipe(
      map((participant) => {
        return res
          .location('/participants/' + participant._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
