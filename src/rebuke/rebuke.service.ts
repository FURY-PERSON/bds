import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rebuke } from './entities/rebuke.entity';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';
import { UsersService } from 'src/users/users.service';
import { CreateRebukeDto } from './dto/createRebuke.dto';
import { UpdateRebuke } from './dto/updateRebuke.dto';
import { MessageExchange, MessageRoute } from 'src/messageProvider/types';


@Injectable()
export class RebukeService {
  constructor(
    @InjectRepository(Rebuke)
    private rebukeRepository: Repository<Rebuke>,
    private usersService: UsersService,
    private messageProvider: MessageProviderService
    ) {

  }

  async cerateRebuke(rebukeDto: CreateRebukeDto) {
    const {userLogin} = rebukeDto;

    const user = await this.usersService.getByLogin(userLogin);

    if(!user) {
      throw new NotFoundException('User doesn`t exist')
    }

    const rebuke = this.rebukeRepository.create({
      ...rebukeDto,
      user: user
    });


    const rebukeEntity = await this.rebukeRepository.save(rebuke);

    this.updateUserRebukes(user.login)

    return rebukeEntity
  }

  async updateRebuke(rebukeDto: UpdateRebuke, id: string) {
    const rebuke = await this.rebukeRepository.findOne({
      where: { id }
    });

    if(!rebuke) {
      throw new HttpException('Rebuke not found', HttpStatus.NOT_FOUND)
    }

    const updatedScientificWork= this.rebukeRepository.create({...rebuke, ...rebukeDto}) 

    const rebukeEntity = await this.rebukeRepository.save(updatedScientificWork)

    this.updateUserRebukes(rebukeEntity.user.login)

    return rebukeEntity;  
  }

  async getById(id: string) {

    return this.rebukeRepository.findOne({
      where: {
        id: id
      },
      relations: {
        user: true,
      }
    });
  }

  async getUserRebukes(login: string) {

    return this.rebukeRepository.find({
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
    return this.rebukeRepository.find({
      relations: {
        user: true
      }
    })
  }


  async deleteByID( id: string) {
    const rebuke = await this.rebukeRepository.findOne({
      where: { id },
      relations: {
        user: true
      }
    });

    if(!rebuke) {
      throw new NotFoundException(`Rebuke id: ${id} not found`)
    }

    await this.rebukeRepository.remove(rebuke)

    this.updateUserRebukes(rebuke.user.login)
  }

  private async updateUserRebukes(userLogin: string) {
    const user = await this.usersService.getByLogin(userLogin);

    if(!user) return;

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, MessageRoute.STUDENT_UPDATE, {
      id: user.id,
      rebukes: user.rebukes?.map((rebuke) => ({
        endDate: rebuke.endDate,
        startDate: rebuke.startDate,
        type: rebuke.type
      }))
    })
  }
}
