import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserInput.email,
    });
    if (existingUser) {
      throw new ConflictException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const createdUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
