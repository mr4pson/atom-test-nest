import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, USER_MODEL } from './database.constants';
import { userModelFn } from './user.model';

export const databaseModelsProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => userModelFn(connection),
    inject: [DATABASE_CONNECTION],
  },
];
