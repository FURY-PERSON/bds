import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { AddRolesDto } from './dto/addRoles.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './users.entity';
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
  @ApiResponse({ type: [User] })
  @Roles("USER")
  @WithRole()
  getAll() {
    return this.usersService.getAllUsers()
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
}
