import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CounterParametersDataInitializerService } from './counter-parameters-data-initializer.service';
import { CounterParametersController } from './counterParameters.controller';
import { CounterParametersService } from './counterParameters.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CounterParametersController],
  providers: [
    CounterParametersService,
    CounterParametersDataInitializerService,
  ],
})
export class CounterParametersModule {}
