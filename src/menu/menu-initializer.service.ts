import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { MENU_MODEL } from '../database/database.constants';
import { Menu } from 'src/database/menu.model';

@Injectable()
export class MenuInitializerService implements OnModuleInit {
  constructor(@Inject(MENU_MODEL) private menuModel: Model<Menu>) {}

  async onModuleInit(): Promise<void> {
    console.log('(MenuModule) is initialized...');
    await this.menuModel.deleteMany({});
    const partners = {
      title: 'Информационные партнеры',
      url: 'partners',
      visible: true,
      editable: false,
      deletable: false,
    };

    const projectPersons = {
      title: 'Лица проекта',
      url: 'projectPersons',
      visible: true,
      editable: false,
      deletable: false,
    };
    await Promise.all([
      this.menuModel.create(partners),
      this.menuModel.create(projectPersons),
    ]).then((data) => console.log(data));
  }
}
