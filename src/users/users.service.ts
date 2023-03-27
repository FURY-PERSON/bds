import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueArray } from 'src/helpers/uniqueArray';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/types';
import { In, Repository } from 'typeorm';
import { AddPermissionsDto } from './dto/addPermissions.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
    private permissionService: PermissionsService,
    ) {

  }

  async createUser(userDto: CreateUserDto) {
    const user = this.usersRepository.create(userDto);
    
    const userRole = await this.roleService.getByName(userDto.roleName); 

    user.role = userRole;

    return this.usersRepository.save(user);
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: {
        role: true,
        permissions: true
      },
    });
    return users;
  }

  async getAllUsersByLogins(logins: string[], relations = true) {
    const users = await this.usersRepository.find({
      where: {
        login: In(logins)
      },
      relations: {
        role: relations,
        permissions: relations
      },
    });
    return users;
  }
  
  async getByLogin(login: string, relations = true) {
    const user = await this.usersRepository.findOne({
      where: {
        login: login
      },
      relations: {
        role: relations,
        permissions: relations,
      }
    });
    
    return user;
  }


  async addPermissions(addRolesDto: AddPermissionsDto) {
    const user = await this.usersRepository.findOne({
      where: {login: addRolesDto.login},
      relations: {
        role: true,
        permissions: true
      }
    })

    if(!user) {
      new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const permissions = await this.permissionService.getAllPermissionsByIds(addRolesDto.permissionsIds);

    const rolesSet = uniqueArray([...user.permissions, ...permissions]);
    user.permissions = rolesSet;

    return this.usersRepository.save(user)
  }

  async updateByLogin(login: string, userDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({where: {
      login: login
    }})

    if(!user) {
      throw new HttpException(`User do not exists`, HttpStatus.BAD_REQUEST)
    }

    const updatedUser = this.usersRepository.create({...user, ...userDto})

    return this.usersRepository.save(updatedUser)
  }
}
