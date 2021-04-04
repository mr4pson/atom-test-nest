import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, throwIfEmpty } from 'rxjs/operators';
import { databaseModelsProviders } from 'src/database/database-models.providers';
import { MENU_MODEL, NEWS_MODEL } from 'src/database/database.constants';
import { Menu } from 'src/database/menu.model';
import { News } from 'src/database/news.model';
import { Subcategory } from 'src/database/subcategory.model';
import { transliterate } from 'src/shared/utils/utils';
import { ChangeNewsDto } from './changeNews.dto';

@Injectable({ scope: Scope.REQUEST })
export class NewsService {
  constructor(
    @Inject(NEWS_MODEL) private newsModel: Model<News>,
    @Inject(MENU_MODEL) private menuModel: Model<Menu>,
  ) {}

  findAll(): Observable<News[]> {
    return from(this.newsModel.find().populate('subcategory').exec());
  }

  findById(id: string): Observable<News> {
    return from(
      this.newsModel.findOne({ _id: id }).populate('subcategory').exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`news:$id was not found`)),
    );
  }

  findByLink(link: string): Observable<News> {
    return from(
      this.newsModel.findOne({ url: link }).populate('subcategory').exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`news:$id was not found`)),
    );
  }

  findByLinks(categoryLink: string, subcategoryLink: string): Observable<any> {
    return from(
      this.menuModel
        .findOne({ url: { $regex: categoryLink, $options: 'i' } })
        .populate('subcategories')
        .exec(),
    ).pipe(
      map((menu) => menu?.subcategories),
      map((subcategories: any) => {
        return subcategories?.find((subcategory: any) => {
          return subcategory.url.includes(subcategoryLink);
        });
      }),
      switchMap((subcategory: Subcategory) => {
        return this.newsModel.find({ subcategory: subcategory._id });
      }),
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`news:$id was not found`)),
    );
  }

  save(data: ChangeNewsDto): Observable<News> {
    const url = transliterate(data.name).split(' ').join('-').toLowerCase();
    const createNews: Promise<News> = this.newsModel.create({
      ...data,
      url: url,
    });
    return from(createNews);
  }

  update(id: string, data: ChangeNewsDto): Observable<News> {
    const url = transliterate(data.name).split(' ').join('-').toLowerCase();
    return from(
      this.newsModel
        .findOneAndUpdate({ _id: id }, { ...data, url: url })
        .exec(),
    ).pipe(throwIfEmpty(() => new NotFoundException(`news:$id was not found`)));
  }

  delete(id: string): Observable<News> {
    return from(this.newsModel.findByIdAndDelete(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`news:$id was not found`)),
    );
  }
}
