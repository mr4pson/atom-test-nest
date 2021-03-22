import { Connection } from 'mongoose';
import { Answer, AnswerSchema } from './answer.model';
import {
  ANSWER_MODEL,
  DATABASE_CONNECTION,
  FAQ_MODEL,
  NEWS_MODEL,
  PARTICIPANT_MODEL,
  PARTNER_MODEL,
  QUESTION_MODEL,
  QUESTION_OPTION_MODEL,
  USER_MODEL,
} from './database.constants';
import { Faq, FaqSchema } from './faq.model';
import { News, NewsSchema } from './news.model';
import { Participant, ParticipantSchema } from './participant.model';
import { Partner, PartnerSchema } from './partner.model';
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
      connection.model<News>('News', NewsSchema, 'news'),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: PARTICIPANT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<Participant>(
        'Participant',
        ParticipantSchema,
        'participants',
      ),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: FAQ_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<Faq>('Faq', FaqSchema, 'faqs'),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: PARTNER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model<Partner>('Partner', PartnerSchema, 'partners'),
    inject: [DATABASE_CONNECTION],
  },
];
