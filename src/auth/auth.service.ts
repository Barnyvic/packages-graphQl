import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { LoginUserInput } from '../users/dto/login-user.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput): Promise<any> {
    const user: User = await this.userService.findByUsername(
      loginUserInput.username,
    );
    const valid = await bcrypt.compare(loginUserInput.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userId: user.id, username: user.username, role: user.role };
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
