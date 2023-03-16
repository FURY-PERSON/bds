import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { WithPermission } from 'src/decorators/withPermission';
import { WithRole } from 'src/decorators/withRoles.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { AddPermissionsDto } from './dto/addPermissions.dto';
import { AddRolesDto } from './dto/addRoles.dto';
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
  @ApiResponse({ type: User })
  create(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.createUser(userDto)
  }

  @ClassSerializer(User)
  @Get('/')
  @ApiQuery({
    name: "logins",
    type: String,
    required: false
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
  @ApiResponse({ type: [User] })
  getById(@Param('login') login: string): Promise<User> {
    return this.usersService.getByLogin(login)
  }

  @ClassSerializer(User)
  @Post('/role')
  @ApiResponse({ type: [User] })
  addRoles(@Body() addRolesDto: AddRolesDto): Promise<User> {
    return this.usersService.addRoles(addRolesDto)
  }

  @ClassSerializer(User)
  @Post('/permission')
  @ApiResponse({ type: [User] })
  addPermissions(@Body() addRolesDto: AddPermissionsDto): Promise<User> {
    return this.usersService.addPermissions(addRolesDto)
  }

  @ClassSerializer(User)
  @Put('/:login')
  @ApiResponse({ type: [User] })
  updateUser(
    @Param('login') login: string,
    @Body() userDto: UpdateUserDto
    ): Promise<User> {
    return this.usersService.updateByLogin(login, userDto)
  }
}
