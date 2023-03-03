import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  @ApiResponse({ type: Role })
  create(@Body() roleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(roleDto)
  }

  @ClassSerializer(Role)
  @Get('/:names')
  @ApiResponse({ type: [Role] })
  getByName(
    @Query('names') names: string[]
    ): Promise<Role[]> {
      const roleNames = Array.isArray(names) ? names : [names];
    return this.roleService.getAllRolesByName(roleNames)
  }

  @ClassSerializer(Role)
  @Get('/')
  @ApiResponse({ type: [Role] })
  getAll(): Promise<Role[]> {
    return this.roleService.getAllRoles()
  }
}
