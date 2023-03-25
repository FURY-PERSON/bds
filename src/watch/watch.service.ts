import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateWatchDto } from './dto/createWatch.dto';
import { UpdateWatchDto } from './dto/UpdateOptDto.dto';
import { WatchStatus } from './types/enums';
import { Watch } from './watch.entity';

@Injectable()
export class WatchService {
  constructor(
    @InjectRepository(Watch)
    private watchRepository: Repository<Watch>,
    private userService: UsersService,
    ) {

  }

  async createWatch(watchDto: CreateWatchDto, creatorLogin: string) {
    const createdWatch = this.watchRepository.create(watchDto)

    if(!watchDto.status) {
      createdWatch.status = WatchStatus.INITIAL
    }

    if(creatorLogin) {
      const creator = await this.userService.getByLogin(creatorLogin, false);
      if(!creator) {
        throw new NotFoundException('creator not found')
      }
      createdWatch.creator = creator
    }

    if(watchDto.executorLogin) {
      const executor = await this.userService.getByLogin(watchDto.executorLogin, false);
      if(!executor) {
        throw new NotFoundException('executor not found') 
      }
      createdWatch.executor = executor
    }
    return this.watchRepository.save(createdWatch);
  }

  async getAllWatch() {
    return this.watchRepository.find({
      relations: {
        executor: true,
        creator: true
      }
    });
  }

  async getById(id: string) {

    return this.watchRepository.findOne({
      where: {
        id: id
      },
      relations: {
        executor: true,
        creator: true
      }
    });
  }

  async getByIds(ids?: string[], executorLogin?: string) {
    return this.watchRepository.find({
      where: {
        id: ids ? In(ids) : undefined,
        executor: {
          login: executorLogin
        }
      },
      relations: {
        executor: true,
        creator: true
      }
    });
  }

  async updateOptById(id: string, updateDto: UpdateWatchDto) {
    const watch = await this.watchRepository.findOne({
      where: {
        id: id
      },
      relations: {
        executor: true,
        creator: true
      }
    });

    if(!watch) {
      throw new NotFoundException(`watch with id: ${id} not found`)
    }

    if(updateDto.creatorLogin) {
      const creator = await this.userService.getByLogin(updateDto.creatorLogin, false);
      if(!creator) {
        throw new NotFoundException('creator not found')
      }
      watch.creator = creator
    }

    if(updateDto.executorLogin) {
      const executor = await this.userService.getByLogin(updateDto.executorLogin, false);
      if(!executor) {
        throw new NotFoundException('executor not found') 
      }
      watch.executor = executor
    }

    return this.watchRepository.save(watch)
  }

}
