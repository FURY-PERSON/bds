import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueArray } from 'src/helpers/uniqueArray';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { AddRolesDto } from './dto/addRoles.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/users.entity';

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

  async addRoles(addRolesDto: AddRolesDto) {
    const user = await this.usersRepository.findOne({
      where: {id: addRolesDto.userId},
      relations: {
        roles: true
      }
    })

    if(!user) {
      new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const roles = await this.roleService.getAllRolesByName(addRolesDto.roles);

    addRolesDto.roles.forEach((roleName) => {
      if(!roles.some((role) => role.name === roleName)) {
        throw new HttpException(`Role ${roleName} doen't exist`, HttpStatus.BAD_REQUEST)
      }
    })

    user.roles = uniqueArray([...user.roles, ...roles]);

    return this.usersRepository.save(user)
  }
}
