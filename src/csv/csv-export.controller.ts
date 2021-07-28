import { Controller, Get, Res, Scope } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { json2csvAsync } from 'json-2-csv';
import { UserService } from 'src/user/user.service';

@ApiTags('csv')
@Controller({ path: 'csv', scope: Scope.REQUEST })
export class CsvExportController {
  constructor(private userService: UserService) {}

  @Get('/export-users')
  async exportUsers(@Res() res) {
    const usersRaw = await this.userService.findAll().toPromise();
    const users = usersRaw.map((user) => {
      const nameParts = user.fullName.split(' ');
      return {
        id: user._id.toString(),
        Фамилия: nameParts[0],
        Имя: nameParts[1],
        Отчество: nameParts[2] ? nameParts[2] : '',
        Пол: user.sex === 'male' ? 'М' : 'Ж',
        email: user.email,
        Телефон: user.phone,
        Город: user.city,
        Ник: user.username,
        'Хэш пароля': user.password,
      };
    });

    const csv = await json2csvAsync(users, { useLocaleFormat: true });

    const BOM = '\uFEFF';
    const csvContent = BOM + csv;

    res.header('Content-type', 'text/csv; charset=utf-8');
    res.attachment('user-table.csv');

    return res.end(csvContent);
  }
}
