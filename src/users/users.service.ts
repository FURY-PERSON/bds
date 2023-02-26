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
    const user = this.usersRepository.create(userDto);
    const userRole = await this.roleService.getByName('USER'); 
    const roles = [userRole]
    user.roles = roles;

    return this.usersRepository.save(user);
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: {
        roles: true
      }
    });
    return users;
  }
  
  async getByLogin(login: string) {
    const user = await this.usersRepository.findOne({
      where: {
        login: login
      },
      relations: {
        roles: true
      }
    });
    return user;
  }
}
