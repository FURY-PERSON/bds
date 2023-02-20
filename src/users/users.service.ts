import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    ) {

  }

  async createUser(userDto: CreateUserDto) {
    const user = await this.usersRepository.save(userDto);
    return user;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }
}
