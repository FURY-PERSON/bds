import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService
  ) {

  }
  
  @ClassSerializer(Role)
  @Post('/')
  @ApiResponse({ type: [Role] })
  create(@Body() roleDto: CreateRoleDto): Promise<CreateRoleDto> {
    return this.roleService.createRole(roleDto)
  }

  @ClassSerializer(Role)
  @Get('/:name')
  @ApiResponse({ type: [Role] })
  getById(@Param('name') name: string): Promise<CreateRoleDto> {
    return this.roleService.getByName(name)
  }

  @ClassSerializer(Role)
  @Get('/')
  @ApiResponse({ type: [Role] })
  getAll(): Promise<CreateRoleDto[]> {
    return this.roleService.getAllRoles()
  }
}
