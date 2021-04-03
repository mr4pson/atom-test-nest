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
      url: '/our-partners',
      visible: true,
      editable: false,
      deletable: false,
    };

    const about = {
      title: 'О проекте',
      url: '/#about',
      visible: true,
      editable: false,
      deletable: false,
    };

    const organizators = {
      title: 'Организаторы',
      url: '/#organizators',
      visible: true,
      editable: false,
      deletable: false,
    };

    await Promise.all([
      this.menuModel.create(about),
      this.menuModel.create(organizators),
      this.menuModel.create(partners),
    ]).then((data) => console.log(data));
  }
}
