import { TestModule } from './test/test.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { NewsModule } from './news/news.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    NewsModule,
    ParticipantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
