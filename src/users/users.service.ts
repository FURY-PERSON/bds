import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueArray } from 'src/helpers/uniqueArray';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/types';
import { Repository } from 'typeorm';
import { AddPermissionsDto } from './dto/addPermissions.dto';
import { AddRolesDto } from './dto/addRoles.dto';
import { CreateUserDto } from './dto/createUser.dto';
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
    const userRole = await this.roleService.getByName(Roles.USER); 

    const roles = [userRole]
    user.roles = roles;
    user.permissions = userRole.permissions;

    return this.usersRepository.save(user);
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: {
        roles: true,
        permissions: true
      },
    });
    return users;
  }
  
  async getByLogin(login: string) {
    const user = await this.usersRepository.findOne({
      where: {
        login: login
      },
      relations: {
        roles: true,
        permissions: true
      }
    });
    
    return user;
  }

  async addRoles(addRolesDto: AddRolesDto) {
    const user = await this.usersRepository.findOne({
      where: {id: addRolesDto.userId},
      relations: {
        roles: true,
        permissions: true
      }
    })

    if(!user) {
      new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const roles = await this.roleService.getAllRolesByName(addRolesDto.roles);

    addRolesDto.roles.forEach((roleName) => {
      if(!roles.some((role) => role.name === roleName)) {
        throw new HttpException(`Role ${roleName} doesn't exist`, HttpStatus.BAD_REQUEST)
      }
    })

    const rolesSet = uniqueArray([...user.roles, ...roles]);
    user.roles = rolesSet;

    const rolesPermissions = rolesSet.map((role) => role.permissions).filter(Boolean).flat();

    user.permissions =  uniqueArray([...user.permissions, ...rolesPermissions]) 

    return this.usersRepository.save(user)
  }

  async addPermissions(addRolesDto: AddPermissionsDto) {
    const user = await this.usersRepository.findOne({
      where: {id: addRolesDto.userId},
      relations: {
        roles: true,
        permissions: true
      }
    })

    if(!user) {
      new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const permissions = await this.permissionService.getAllPermissionsByIds(addRolesDto.permissions);

    addRolesDto.permissions.forEach((roleName) => {
      if(!permissions.some((role) => role.name === roleName)) {
        throw new HttpException(`Permission ${roleName} doesn't exist`, HttpStatus.BAD_REQUEST)
      }
    })

    const rolesSet = uniqueArray([...user.permissions, ...addRolesDto.permissions]);
    user.permissions = rolesSet;

    return this.usersRepository.save(user)
  }
}
