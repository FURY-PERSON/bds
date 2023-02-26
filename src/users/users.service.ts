import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
    ) {

  }

  async createUser(userDto: CreateUserDto) {
    const user = this.usersRepository.save({
      ...this.usersRepository.create(userDto),
      roles: [await this.roleService.getByName('USER')]
    })

    return user;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: {
        roles: true
      }
    });
    return users;
  }
}
