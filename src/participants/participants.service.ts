import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { PARTICIPANT_MODEL } from 'src/database/database.constants';
import { Participant } from 'src/database/participant.model';
import { ChangeParticipantDto } from './changeParticipant.dto';

@Injectable({ scope: Scope.REQUEST })
export class ParticipantsService {
  constructor(
    @Inject(PARTICIPANT_MODEL) private participantModel: Model<Participant>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<Participant[]> {
    return from(this.participantModel.find().exec());
  }

  save(data: ChangeParticipantDto): Observable<Participant> {
    const createParticipant: Promise<Participant> = this.participantModel.create(
      {
        ...data,
      },
    );
    return from(createParticipant);
  }

  update(id: string, data: ChangeParticipantDto): Observable<Participant> {
    return from(
      this.participantModel.findOneAndUpdate({ _id: id }, { ...data }).exec(),
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`participant:$id was not found`),
      ),
    );
  }

  delete(id: string): Observable<Participant> {
    return from(
      this.participantModel.findOneAndDelete({ _id: id }).exec(),
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`participant:$id was not found`),
      ),
    );
  }
}
