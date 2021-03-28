import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserService } from './user.service';

@ApiTags('profile')
@Controller()
export class ProfileController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any): any {
    return this.userService.findById(req.user.id);
  }
}
