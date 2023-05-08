import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
import { GetAllUsersParam } from './types/types';

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
    const user = await this.usersRepository.findOne({
      where: {
        login: userDto.login
      }
    })

    if(user) {
      throw new BadRequestException(`User with login ${userDto.login} already exists`)
    }

    const createdUser =  this.usersRepository.create(userDto);

    const userRole = await this.roleService.getByName(userDto.roleName); 

    if(!userRole) {
      throw new NotFoundException(`Role ${userDto.roleName} not found`)
    }

    createdUser.role = userRole;

    return this.usersRepository.save(createdUser);
  }

  async getAllUsers(query: GetAllUsersParam) {
    const take = query.limit
    const page = query.page || 1;
    const loginSearch = query.login;
    const orderBy = query.orderBy;
    const roleName = query.role;
    const sort = 'user.' + query.sort;

    const createdQuery = this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .leftJoin('user.permissions', 'permissions')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phone',
        'user.login',
        'user.email',
        'role',
        'permissions',
      ])
      .where('user.login ILIKE :login', {login: `%${loginSearch}%`})
      .orderBy(sort, orderBy);

      if(roleName) {
        createdQuery.andWhere('user.role.name LIKE :roleName', {roleName: `%${roleName}%`})
      }

      if(take && page) {
        const skip = (page-1) * take ;
        createdQuery      
          .take(take)
          .skip(skip)
      }

    const [result, total] = await  createdQuery.getManyAndCount()

    const totalPage = take && Math.ceil(total / take)

    return {
      result, 
      total,
      totalPage
    }
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
    const user = await this.usersRepository.findOne({
      where: {
        login: login
      },
      relations: {
        role: true,
        permissions: true
      }
    })

    if(!user) {
      throw new HttpException(`User do not exists`, HttpStatus.BAD_REQUEST)
    }

    const updatedUser = this.usersRepository.create({
      ...user,
      firstName: userDto.firstName ?? user.firstName,
      lastName: userDto.lastName ?? user.lastName,
      phone: userDto.phone ?? user.phone,
      email: userDto.email ?? user.email,
      refreshToken: userDto.refreshToken ?? user.refreshToken,
    })

    if(userDto.roleName && user.role.name !== userDto.roleName) {
      const newRole = await this.roleService.getByName(userDto.roleName);

      if(!newRole) {
        throw new NotFoundException(`Role ${userDto.roleName} not found`)
      }

      updatedUser.role = newRole
    }

    if(userDto.permissionsIds) {
      const oldPermissionsIds = user.permissions?.map((per) => per.id) || []
      const permissionsIds = Array.from(new Set([...oldPermissionsIds, ...userDto.permissionsIds]))

      const newPermissions = await this.permissionService.getAllPermissionsByIds(permissionsIds);

      updatedUser.permissions = newPermissions
    }

    return this.usersRepository.save(updatedUser)
  }
}
