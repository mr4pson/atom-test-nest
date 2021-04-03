import {
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Scope,
  Controller,
  Delete,
  Put,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { News } from 'src/database/news.model';
import { RoleType } from 'src/shared/enum/role-type.enum';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeNewsDto } from './changeNews.dto';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller({ path: 'news', scope: Scope.REQUEST })
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('')
  getNews(): Observable<any[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  getNewsById(@Param('id', ParseObjectIdPipe) id: string): Observable<News> {
    return this.newsService.findById(id);
  }

  @Post('')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createNews(@Body() news: ChangeNewsDto, @Res() res: any): Observable<News> {
    return this.newsService.save(news).pipe(
      map((news) => {
        return res
          .location('/news/' + news._id)
          .status(HttpStatus.CREATED)
          .send();
      }),
    );
  }

  @Put(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() news: ChangeNewsDto,
    @Res() res: any,
  ): Observable<News> {
    return this.newsService.update(id, news).pipe(
      map((news) => {
        return res
          .location('/news/' + news._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: any,
  ): Observable<News> {
    return this.newsService.delete(id).pipe(
      map((news) => {
        return res
          .location('/news/' + news._id)
          .status(HttpStatus.OK)
          .send();
      }),
    );
  }
}
