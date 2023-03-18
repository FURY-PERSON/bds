import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateOptDto } from './dto/createOpt.dto';
import { UpdateOptDto } from './dto/updateOpt.dto';
import { Opt } from './opt.entity';
import { OptStatus } from './types/enums';

@Injectable()
export class OptService {
  constructor(
    @InjectRepository(Opt)
    private optRepository: Repository<Opt>,
    private userService: UsersService,
    ) {

  }

  async createOpt(optDto: CreateOptDto) {
    if(!optDto.executorsLogins) {
      return this.optRepository.save({...optDto, ...{status: OptStatus.INITIAL}});
    }

    const users = await this.findAndValidateUsers(optDto.executorsLogins);

    return this.optRepository.save({...optDto, ...{executors: users, status: OptStatus.INITIAL}});
  }

  async getAllOpt() {
    return this.optRepository.find({
      relations: {
        executors: true
      }
    });
  }

  async getById(id: string) {

    return this.optRepository.findOne({
      where: {
        id: id
      },
      relations: {
        executors: true
      }
    });
  }

  async getByIds(ids: string[]) {
    return this.optRepository.find({
      where: {
        id: In(ids)
      }
    });
  }

  async updateOptById(id: string, updateDto: UpdateOptDto) {
    const opt = await this.optRepository.findOne({
      where: {
        id: id
      }
    });

    if(!opt) {
      throw new NotFoundException(`Opt with id: ${id} not found`)
    }

    if(!updateDto.executorsLogins) {
      return this.optRepository.save({...opt, ...updateDto})
    }

    const users = await this.findAndValidateUsers(updateDto.executorsLogins);

    return this.optRepository.save({...opt, ...updateDto, ...{executors: users}})
  }

  private async findAndValidateUsers(logins: string[]) {
    const users = await this.userService.getAllUsersByLogins(logins, false);

    if(users.length !== logins.length) {
      const notFoundUsersIds = logins.filter((login) => !users.some((user) => user.login == login))
      throw new NotFoundException(`Users: ${notFoundUsersIds.join(', ')} not found`)
    }

    return users
  }
}
