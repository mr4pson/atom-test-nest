import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Req,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HasRoles } from 'src/auth/guard/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { RoleType } from 'src/shared/enum/role-type.enum';
import {
  allTimeDateFrom,
  currentDate,
  lastMonthDateFrom,
  lastWeekDateFrom,
} from './constants';
import { GetStatisticsDto } from './get-statistics.dto';
import { StatisticsService } from './statistics.service';
import { parseRussianDate } from './utils';

@ApiTags('statistics')
@Controller({ path: 'statistics', scope: Scope.REQUEST })
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}
  @Get('/registered-users')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRegisteredUsers(@Query() query): Observable<any> {
    return forkJoin([
      this.statisticsService.getUserStatsGroupedByMonthAndYear(
        query.dateFrom,
        query.dateTo,
      ),
      this.statisticsService.getUserNumber(lastWeekDateFrom, currentDate),
      this.statisticsService.getUserNumber(lastMonthDateFrom, currentDate),
      this.statisticsService.getUserNumber(allTimeDateFrom, currentDate),
    ]).pipe(
      map(([userStats, weekNumber, monthNumber, allTimeNumber]) => ({
        weekNumber,
        monthNumber,
        allTimeNumber,
        userStats,
      })),
    );
  }

  @Get('/passed-dictation')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getPassedDictation(@Query() query: GetStatisticsDto): Observable<any> {
    return forkJoin([
      this.statisticsService.getPassedDictation(
        parseRussianDate(query.dateFrom).toISOString(),
        parseRussianDate(query.dateTo).toISOString(),
      ),
      this.statisticsService.getRegisteredUsersByDates(
        parseRussianDate(query.dateFrom).toISOString(),
        parseRussianDate(query.dateTo).toISOString(),
      ),
      this.statisticsService.getPassedDictation(lastWeekDateFrom, currentDate),
      this.statisticsService.getPassedDictation(lastMonthDateFrom, currentDate),
      this.statisticsService.getPassedDictation(allTimeDateFrom, currentDate),
    ]).pipe(
      map(
        ([
          passedDictation,
          registeredUsers,
          weekNumber,
          monthNumber,
          allTimeNumber,
        ]) => ({
          notPassedDictation:
            registeredUsers >= passedDictation
              ? registeredUsers - passedDictation
              : 0,
          passedDictation,
          weekNumber,
          monthNumber,
          allTimeNumber,
        }),
      ),
    );
  }
}
