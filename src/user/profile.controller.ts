import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserService } from './user.service';

@Controller()
export class ProfileController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any): any {
    return this.userService.findById(req.user.id);
  }
}
