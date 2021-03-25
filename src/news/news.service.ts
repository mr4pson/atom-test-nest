import { Inject, NotFoundException } from '@nestjs/common';
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
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

  findById(id: string): Observable<News> {
    return from(this.newsModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`faq:$id was not found`)),
    );
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
