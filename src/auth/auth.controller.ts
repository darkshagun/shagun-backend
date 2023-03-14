import { Controller, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const isPasswordMatching = await bcrypt.compare(
      req.body.password,
      req?.user.password,
    );
    if(isPasswordMatching&&req.body.username===req.user.username){
      if(req.user.is_active){
        return this.authService.loginWithCredentials(req.user);
      }
      else throw new UnauthorizedException("!oho your account has been temporarily blocked by admin");
     
    }
    else   throw new UnauthorizedException();
    
  }

}
