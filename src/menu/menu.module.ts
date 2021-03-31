import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MenuInitializerService } from './menu-initializer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuController],
  providers: [MenuService, MenuInitializerService],
})
export class MenuModule {}
