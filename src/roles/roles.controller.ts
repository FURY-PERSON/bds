import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { Roles } from './types';

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
  @Get('/')
  @ApiQuery({
    name: "names",
    type: String,
    required: false
  })
  @ApiResponse({ type: [Role] })
  getByNames(
    @Query('names') names: string[]
    ): Promise<Role[]> {
      if(!names) {
        return this.roleService.getAllRoles()
      }

      const roleNames = Array.isArray(names) ? names : [names];
    return this.roleService.getAllRolesByName(roleNames)
  }

  @ClassSerializer(Role)
  @Get('/:name')
  @ApiResponse({ type: Role })
  getByName(
    @Param('name') name: Roles
    ): Promise<Role> {

    return this.roleService.getByName(name)
  }
}
