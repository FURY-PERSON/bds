import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  @ApiResponse({ type: [User] })
/*   @Permissions('user', 'worker')
  @WithPermission() */
/*   @Roles("user")
  @WithRole() */
  getAll(
    @Query('logins') logins?: string[]
  ) {
    if(!logins) {
      return this.usersService.getAllUsers()
    }

    const userLogins = Array.isArray(logins) ? logins : [logins];
    return this.usersService.getAllUsersByLogins(userLogins);
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
