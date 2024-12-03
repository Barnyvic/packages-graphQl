import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserInput } from '../users/dto/login-user.input';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput): Promise<any> {
    const user: User = await this.usersService.findByEmail(
      loginUserInput.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(loginUserInput.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userId: user.id, email: user.email, role: user.role };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
    };
  }
}
