import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { Permission } from './permisions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    ) {

  }

  async createPermission(userDto: CreatePermissionDto) {
    const permission = await this.permissionRepository.save(userDto);
    return permission;
  }

  async getAllPermissions() {
    return this.permissionRepository.find();
  }

  async getAllPermissionsByIds(ids: string[]) {
    return this.permissionRepository.find({
      where: {
        id: In(ids)
      }
    });
  }

  async getById(id: string) {
    return this.permissionRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
