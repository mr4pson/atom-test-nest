import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CounterParameters } from 'src/database/counters-parameters.model';
import { COUNTER_PARAMETERS_MODEL } from '../database/database.constants';
import { counterParametersType } from 'src/shared/enum/counterParametersType';

@Injectable()
export class CounterParametersDataInitializerService implements OnModuleInit {
  constructor(
    @Inject(COUNTER_PARAMETERS_MODEL)
    private counterParametersModel: Model<CounterParameters>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.counterParametersModel.deleteMany({});

    const bannerParameters = {
      type: counterParametersType.BANNER,
      data: '2021-03-23 23:02:28',
    };

    const testParameters = {
      type: counterParametersType.TEST,
      data: JSON.stringify({ testHours: 1, testMinutes: 0, testSeconds: 0 }),
    };

    await Promise.all([
      this.counterParametersModel.create(bannerParameters),
      this.counterParametersModel.create(testParameters),
    ]).then((data) => console.log(data));
  }
}
