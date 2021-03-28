import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { RegisterDto } from './register.dto';
import { UserService } from './user.service';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  constructor(private userService: UserService) {}

  @Post()
  register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ): Observable<Response> {
    const username = registerDto.username;

    return this.userService.existsByUsername(username).pipe(
      mergeMap((exists) => {
        if (exists) {
          throw new ConflictException(`username:${username} is existed`);
        } else {
          const email = registerDto.email;
          return this.userService.existsByEmail(email).pipe(
            mergeMap((exists) => {
              if (exists) {
                throw new ConflictException(`email:${email} is existed`);
              } else {
                return this.userService.register(registerDto).pipe(
                  map((user) =>
                    res
                      .location('/users/' + user.id)
                      .status(HttpStatus.CREATED)
                      .send(),
                  ),
                );
              }
            }),
          );
        }
      }),
    );
  }
}
