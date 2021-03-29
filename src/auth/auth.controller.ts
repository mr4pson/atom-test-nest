import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Observable<Response> {
    return this.userService.findById(req.user.id).pipe(
      switchMap((user) => {
        return this.authService.login(user).pipe(
          map((token) => {
            return res
              .header('Authorization', 'Bearer ' + token.access_token)
              .json(token)
              .send();
          }),
        );
      }),
    );
  }
}
