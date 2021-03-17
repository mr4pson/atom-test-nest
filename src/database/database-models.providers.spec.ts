import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import { DATABASE_CONNECTION, USER_MODEL } from './database.constants';
import { databaseModelsProviders } from './database-models.providers';
import { User } from './user.model';

describe('DatabaseModelsProviders', () => {
  let conn: any;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...databaseModelsProviders,

        {
          provide: DATABASE_CONNECTION,
          useValue: {
            model: jest.fn().mockReturnValue({} as Model<User>),
          },
        },
      ],
    }).compile();

    conn = module.get<Connection>(DATABASE_CONNECTION);
    userModel = module.get<Model<User>>(USER_MODEL);
  });

  it('DATABASE_CONNECTION should be defined', () => {
    expect(conn).toBeDefined();
  });

  it('USER_MODEL should be defined', () => {
    expect(userModel).toBeDefined();
  });
});
