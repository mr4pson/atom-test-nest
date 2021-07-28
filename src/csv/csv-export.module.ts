import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { CsvExportController } from './csv-export.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CsvExportController],
  providers: [UserService],
})
export class CsvExportModule {}
