import { Connection } from 'mongoose';
import { Answer, AnswerSchema } from './answer.model';
import {
  ANSWER_MODEL,
  DATABASE_CONNECTION,
  NEWS_MODEL,
  QUESTION_MODEL,
  QUESTION_OPTION_MODEL,
  USER_MODEL,
} from './database.constants';
import { News, NewsSchema } from './news.model';
import { Question, QuestionSchema } from './question.model';
import { QuestionOption, QuestionOptionSchema } from './questionOption.model';
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
  {
    provide: QUESTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<Question>('Question', QuestionSchema, 'questions'),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: QUESTION_OPTION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<QuestionOption>(
        'QuestionOption',
        QuestionOptionSchema,
        'questionOptions',
      ),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: NEWS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<News>(
        'News',
        NewsSchema,
        'news',
      ),
    inject: [DATABASE_CONNECTION],
  },
];
