import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { MENU_MODEL } from 'src/database/database.constants';
import { Menu } from 'src/database/menu.model';
import { ChangeMenuDto } from './change-menu.dto';

@Injectable()
export class MenuService {
  constructor(@Inject(MENU_MODEL) private menuModel: Model<Menu>) {}

  findAll(): Observable<Menu[]> {
    return from(this.menuModel.find().exec());
  }

  findById(id: string): Observable<Menu> {
    return from(this.menuModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`menu:$id was not found`)),
    );
  }

  save(data: ChangeMenuDto): Observable<Menu> {
    const createMenu: Promise<Menu> = this.menuModel.create({
      ...data,
    });
    return from(createMenu);
  }

  update(id: string, data: ChangeMenuDto): Observable<any> {
    return from(
      this.menuModel
        .findOneAndUpdate({ _id: id }, { ...data } as any, { new: true })
        .exec(),
    ).pipe(throwIfEmpty(() => new NotFoundException(`menu:$id was not found`)));
  }

  deleteById(id: string): Observable<Menu> {
    return from(this.menuModel.findByIdAndRemove(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`menu:$id was not found`)),
    );
  }
}
