import { Get, Post, Body, Res, UseGuards, Scope, Controller, Delete, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { NewsDto } from './news.dto';
import { NewsService } from './news.service';

@Controller({ path: 'news', scope: Scope.REQUEST })
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getNews(): Observable<any[]> {
    return
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  createNews(): Observable<any> {
    return
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  updateNews(): Observable<any> {
    return
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  deleteNews(): Observable<any> {
    return
  }
}