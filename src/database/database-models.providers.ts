import { Connection } from 'mongoose';
import { Answer, AnswerSchema } from './answer.model';
import {
  ANSWER_MODEL,
  DATABASE_CONNECTION,
  USER_MODEL,
} from './database.constants';
import { userModelFn } from './user.model';

export const databaseModelsProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => userModelFn(connection),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: ANSWER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<Answer>('Answer', AnswerSchema, 'answers'),
    inject: [DATABASE_CONNECTION],
  },
];
