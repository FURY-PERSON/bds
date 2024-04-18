import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';
import { MessageExchange, MessageRoute } from 'src/messageProvider/types';
import { CreateScientificWorksDto } from './dto/createScientificWorks.dto';
import { ScientificWork } from './entities/scientificWorks.entity';
import { UpdateScientificWorksDto } from './dto/updateScientificWorks.dto';

@Injectable()
export class ScientificWorksService {
  constructor(
    @InjectRepository(ScientificWork)
    private scientificWorkRepository: Repository<ScientificWork>,
    private usersService: UsersService,
    private messageProvider: MessageProviderService
    ) {

  }

  async createScientificWork(scientificWorkDto: CreateScientificWorksDto) {
    const {creatorLogin} = scientificWorkDto;

    const user = await this.usersService.getByLogin(creatorLogin);

    if(!user) {
      throw new NotFoundException('User doesn`t exist')
    }

    const scientificWork = this.scientificWorkRepository.create({
      ...scientificWorkDto,
      user: user
    });

    const scientificWorkEntity = await this.scientificWorkRepository.save(scientificWork)

    this.updateUserScientificWorks(user.login)
    
    return scientificWorkEntity;
  }

  async updateScientificWork(scientificWorkDto: UpdateScientificWorksDto, id: string) {
    const scientificWork = await this.scientificWorkRepository.findOne({
      where: { id }
    });

    if(!scientificWork) {
      throw new HttpException('ScientificWork not found', HttpStatus.NOT_FOUND)
    }

    const updatedScientificWork= this.scientificWorkRepository.create({...scientificWork, ...scientificWorkDto}) 



    if(!scientificWorkDto.creatorLogin) {
      const scientificWorkEntity = await this.scientificWorkRepository.save(updatedScientificWork);

      this.updateUserScientificWorks(scientificWorkEntity.user.login)

      return scientificWorkEntity;  
    }
    
    const user = await this.usersService.getByLogin(scientificWorkDto.creatorLogin);

    if(!user) {
      throw new NotFoundException('User doesn`t exist')
    }


    updatedScientificWork.user = user;

    const scientificWorkEntity = await this.scientificWorkRepository.save(updatedScientificWork);

    this.updateUserScientificWorks(user.login)

    return scientificWorkEntity;  
  }

  async getById(id: string) {

    return this.scientificWorkRepository.findOne({
      where: {
        id: id
      },
      relations: {
        user: true,
      }
    });
  }

  async getUsersScientificWorks(login: string) {

    return this.scientificWorkRepository.find({
      where: {
        user: {
          login: login
        }
      },
      relations: {
        user: true,
      }
    });
  }

  async getAll() {
    return this.scientificWorkRepository.find({
      relations: {
        user: true
      }
    })
  }


  async deleteByID( id: string) {
    const scientificWork = await this.scientificWorkRepository.findOne({
      where: { id },
      relations: {
        user: true
      }
    });

    if(!scientificWork) {
      throw new NotFoundException(`ScientificWork id: ${id} not found`)
    }

    await this.scientificWorkRepository.remove(scientificWork)

    this.updateUserScientificWorks(scientificWork.user.login)
  }

  private async updateUserScientificWorks(userLogin: string) {
    const user = await this.usersService.getByLogin(userLogin);

    if(!user) return;

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, MessageRoute.STUDENT_UPDATE, {
      id: user.id,
      scientificWorks: user.scientificWorks?.map((scientificWork) => ({
        date: scientificWork.date,
        type: scientificWork.type
      }))
    })
  }
}
