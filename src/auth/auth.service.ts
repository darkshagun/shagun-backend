import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { uid, suid } from 'rand-token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ username });
    if (!user) return null;
    if (!user) {
        throw new NotAcceptableException('could not find the user');
    }
    if (user) {
        return user;
    }
    return null;
  }
  async generateRefreshToken(userId):  Promise<string>{
    var refreshToken = suid(16)
    var expirydate =new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    // await this.usersService.saveorupdateRefreshToke(refreshToken, userId, expirydate);
    return refreshToken
  }

  async loginWithCredentials(user: any) {
    const payload = { username: user.username,user_group:user.usergroup,is_staff:true,is_active:user.is_active};
    return {
      username: user.username,
      fullname:user.fullname,
      is_active: user.is_active,
      user_group:user.usergroup,
      id:user._id,
      access_token: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user.userId),
      expiredAt: Date.now() + 60000,
    };
  }
}
