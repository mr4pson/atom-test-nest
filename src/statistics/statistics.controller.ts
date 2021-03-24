import { Body, Controller, Get, Scope, UseGuards } from '@nestjs/common';
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

@Controller({ path: 'statistics', scope: Scope.REQUEST })
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}
  @Get('/registered-users')
  @HasRoles(RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRegisteredUsers(@Body() body: GetStatisticsDto): Observable<any> {
    return forkJoin([
      this.statisticsService.getUserStatsGroupedByMonthAndYear(
        body.dateFrom,
        body.dateTo,
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
  getPassedDictation(@Body() body: GetStatisticsDto): Observable<any> {
    return forkJoin([
      this.statisticsService.getPassedDictation(body.dateFrom, body.dateTo),
      this.statisticsService.getRegisteredUsersByDates(
        body.dateFrom,
        body.dateTo,
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
