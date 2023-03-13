import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @Get('/')
  @WithAuth()
  @ApiResponse({ type: [Permission] })
  getAll() {
    return this.permissionService.getAllPermissions()
  }

  @ClassSerializer(Permission)
  @Get('/:ids')
  @ApiResponse({ type: [Permission] })
  getByName(
    @Query('ids') ids: string[]
    ): Promise<Permission[]> {
      const permissionIds = Array.isArray(ids) ? ids : [ids];
    return this.permissionService.getAllPermissionsByIds(permissionIds)
  }
}
