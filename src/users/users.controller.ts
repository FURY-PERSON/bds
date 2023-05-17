import { Body, Controller, Get, Param, Post, Put, Query, Response } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { WithPermission } from 'src/decorators/withPermission';
import { WithRole } from 'src/decorators/withRoles.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { AddPermissionsDto } from './dto/addPermissions.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { Roles as RoleNames } from 'src/roles/types';
import { Response as Res } from 'express';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {

  }

  @ClassSerializer(User)
  @Post('/')
  @WithAuth()
  @ApiResponse({ type: User })
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto)
  }

  @ClassSerializer(User)
  @Get('/')
  @WithAuth()
  @ApiQuery({
    name: "logins",
    type: String,
    required: false,
    isArray: true
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "login",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "sort",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "role",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "orderBy",
    type: String,
    required: false,
  })
  @ApiResponse({ type: [User] })
/*   @Permissions('user', 'worker')
  @WithPermission() */
/*   @Roles("user")
  @WithRole() */
  async getAll(
    @Query('logins') logins?: string[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy: 'DESC' | 'ASC' = 'DESC',
    @Query('login') login: string = '',
    @Query('sort') sort: "login" | "firstName" | "lastName" = 'login',
    @Query('role') role?: RoleNames,
    @Response() res?: Res
  ) {

    if(logins) {
      const usersLogin = Array.isArray(logins) ? logins : [logins];
      const users = await this.usersService.getAllUsersByLogins(usersLogin);
      res.send(users)
      return users
    }

    const {result, total, totalPage} = await this.usersService.getAllUsers({page, limit, orderBy, role, login, sort})
    res.set({'X-Total-Item': total })
    res.set({'X-Current-Page': page })
    res.set({'X-Total-Page': totalPage})
    res.send(result)
    return result
  }

  @ClassSerializer(User)
  @Get('/:login')
  @WithAuth()
  @ApiResponse({ type: User })
  getById(@Param('login') login: string): Promise<User> {
    return this.usersService.getByLogin(login)
  }

  @ClassSerializer(User)
  @Post('/permission')
  @WithAuth()
  @ApiResponse({ type: User })
  addPermissions(@Body() addRolesDto: AddPermissionsDto): Promise<User> {
    return this.usersService.addPermissions(addRolesDto)
  }

  @ClassSerializer(User)
  @Put('/:login')
  @WithAuth()
  @ApiResponse({ type: User })
  updateUser(
    @Param('login') login: string,
    @Body() userDto: UpdateUserDto
    ): Promise<User> {
    return this.usersService.updateByLogin(login, userDto)
  }
}
