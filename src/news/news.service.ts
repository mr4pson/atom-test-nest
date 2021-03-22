import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { throwIfEmpty } from 'rxjs/operators';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { NEWS_MODEL } from 'src/database/database.constants';
import { News } from 'src/database/news.model';
import { ChangeNewsDto } from './changeNews.dto';

@Injectable({ scope: Scope.REQUEST })
export class NewsService {
  constructor(
    @Inject(NEWS_MODEL) private newsModel: Model<News>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(): Observable<News[]> {
    return from(this.newsModel.find().exec());
  }

  save(data: ChangeNewsDto): Observable<News> {
    const createNews: Promise<News> = this.newsModel.create({
      ...data,
    });
    return from(createNews);
  }

  update(id: string, data: ChangeNewsDto): Observable<News> {
    return from(
      this.newsModel.findOneAndUpdate({ _id: id }, { ...data }).exec(),
    ).pipe(throwIfEmpty(() => new NotFoundException(`news:$id was not found`)));
  }

  delete(id: string): Observable<News> {
    return from(this.newsModel.findByIdAndDelete(id).exec()).pipe(
      throwIfEmpty(() => new NotFoundException(`news:$id was not found`)),
    );
  }
}
