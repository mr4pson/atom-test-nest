import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MenuInitializerService } from './menu-initializer.service';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MenuController, SubcategoryController],
  providers: [MenuService, MenuInitializerService, SubcategoryService],
})
export class MenuModule {}
