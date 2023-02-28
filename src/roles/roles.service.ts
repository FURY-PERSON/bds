import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    ) {

  }

  async createRole(userDto: CreateRoleDto) {
    const user = await this.rolesRepository.save(userDto);
    return user;
  }

  async getAllRoles() {
    const roles = await this.rolesRepository.find();
    return roles;
  }

  async getAllRolesByName(rolesNames: string[]) {
    const roles = await this.rolesRepository.find({where: {
      name: In(rolesNames)
    }});
    return roles;
  }

  async getByName(name: string) {
    const role = await this.rolesRepository.findOne({where: {name: name}});
    return role;
  }
}
