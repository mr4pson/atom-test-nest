import { Get, Post, Body, Res, UseGuards, Scope, Controller, Delete, Put, HttpStatus, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeNewsDto } from './changeNews.dto';
import { NewsService } from './news.service';

@Controller({ path: 'news', scope: Scope.REQUEST })
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  getNews(): Observable<any[]> {
    return this.newsService.findAll();
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard)
  createNews(@Body() news: ChangeNewsDto, @Res() res: any): Observable<any> {
    return this.newsService.save(news).pipe(
      map((news) => {
        return res
          .location('/news/' + news._id)
          .status(HttpStatus.CREATED)
          .send();
      })
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard)
  updateNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() news: ChangeNewsDto,
    @Res() res: any
  ): Observable<any> {
    return this.newsService.update(id, news).pipe(
      map((news) => {
        return res
          .location('/news/' + news._id)
          .status(HttpStatus.OK)
          .send();
      })
    )
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard)
  deleteNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any
  ): Observable<any> {
    return this.newsService.delete(id).pipe(
      map((news) => {
        return res
        .location('/news/' + news._id)
        .status(HttpStatus.OK)
        .send();
      })
    )
  }
}