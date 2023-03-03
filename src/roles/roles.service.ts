import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from 'src/permissions/permissions.service';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
    ) {

  }

  async createRole(userDto: CreateRoleDto) {
    const user = this.rolesRepository.create(userDto);
    const permissions = await this.permissionsService.getAllRolesByIds(userDto.permissionsIds);
    user.permissions = permissions;
    return this.rolesRepository.save(user);
  }

  async getAllRoles() {
    const roles = await this.rolesRepository.find({
      relations: {
        permissions: true
      }
    });
    return roles;
  }

  async getAllRolesByName(rolesNames: string[]) {
    const roles = await this.rolesRepository.find({
      where: {
        name: In(rolesNames),
      },
      relations: {
        permissions: true
      }
    });
    return roles;
  }

  async getByName(name: string) {
    const role = await this.rolesRepository.findOne({
      where: { name },
      relations: {
        permissions: true
      }
    });
    return role;
  }
}
