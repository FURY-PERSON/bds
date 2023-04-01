import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { Permission } from './permisions.entity';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionService: PermissionsService
  ) {

  }
  
  @ClassSerializer(Permission)
  @Post('/')
  @ApiResponse({ type: Permission })
  create(@Body() userDto: CreatePermissionDto): Promise<CreatePermissionDto> {
    return this.permissionService.createPermission(userDto)
  }

  @ClassSerializer(Permission)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: [Permission] })
  getById(
    @Param('ids') id: string
    ): Promise<Permission> {
      return this.permissionService.getById(id)
  }

  @ClassSerializer(Permission)
  @Get('/')
  @WithAuth()
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @ApiResponse({ type: [Permission] })
  getByNames(
    @Query('ids') ids: string[]
    ): Promise<Permission[]> {
      if(!ids) {
        return this.permissionService.getAllPermissions()
      }

    const permissionIds = Array.isArray(ids) ? ids : [ids];
    return this.permissionService.getAllPermissionsByIds(permissionIds)
  }
}
