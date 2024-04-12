import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { In, Repository } from 'typeorm';
import { CreateBlockDto } from './dto/createBlock.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';
import { Block } from './entities/block.entity';
import { GetAllBlocksParam } from './types/types';
import { CreateBlockSanitaryVisitDto } from './dto/createBlockSanitaryVisit.dto';
import { BlockSanitaryVisit } from './entities/blockSanitaryVisit.entity';
import { allBlockSanitaryEntity, blockSanitaryEntityToNameMap } from './types/blockSanitary';
import { BlockSanitaryMark } from './entities/blockSanitaryMark.entity';
import { UpdateBlockSanitaryVisitDto } from './dto/updateBlockSanitaryVisit.dto';
import { UpdateBlockSanitaryMarkDto } from './dto/updateBlockSanitaryMark.dto';
import { AddUserToBlockDto } from './dto/addUserToBlock.dto';
import { UsersService } from 'src/users/users.service';
import { DeleteUserFromBlock } from './dto/deleteUserFromBlock.dto';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';
import { MessageExchange, MessageRoute } from 'src/messageProvider/types';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockSanitaryMark)
    private blockSanitaryMarkRepository: Repository<BlockSanitaryMark>,
    @InjectRepository(BlockSanitaryVisit)
    private blockSanitaryVisitRepository: Repository<BlockSanitaryVisit>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private dormService: DormsService,
    private usersService: UsersService,
    private messageProvider: MessageProviderService
    ) {

  }

  async createBlock(blockDto: CreateBlockDto) {
    const {dormId} = blockDto;

    const dorm = await this.dormService.getById(dormId);

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const block = this.blockRepository.create({
      ...blockDto,
      dorm: dorm
    });
    
    return this.blockRepository.save(block);
  }

  async updateBlock(blockDto: UpdateBlockDto, id: string) {
    const block = await this.blockRepository.findOne({
      where: { id }
    });
    
    if(!block) {
      throw new HttpException('Block not found', HttpStatus.NOT_FOUND)
    }

    const updatedBlock = this.blockRepository.create({
      ...block,
      number: blockDto.number ?? block.number
    }) 

    if(!blockDto.dormId) {
      return this.blockRepository.save(updatedBlock);  
    }
    
    const dorm = await this.dormService.getById(blockDto.dormId);

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    updatedBlock.dorm = dorm;

    return this.blockRepository.save(updatedBlock);  
  }

  async getById(id: string) {

    return this.blockRepository.findOne({
      where: {
        id: id
      },
      relations: {
        dorm: true,
        rooms: true,
        tenants: true        
      }
    });
  }

  async getByDormId(dormId: string) {

    return this.blockRepository.find({
      where: {
        dorm: {
          id: dormId
        }
      },
      relations: {
        rooms: true,
        tenants: true,
      }
    });
  }

  async getByIds(ids?: string[]) {
    return this.blockRepository.find({
      where: {
        id: ids ? In(ids) : undefined,
      },
      relations: {
        dorm: true,
        rooms: true
      }
    });
  }


  async getAllBlocks(query: GetAllBlocksParam) {
    const take = query.limit || 20
    const page = query.page || 1;
    const numberSearch = query.number || '';
    const orderBy = query.orderBy;
    const floor = query.floor;

    const createdQuery = this.blockRepository.createQueryBuilder('block')
      .leftJoin('block.dorm', 'dorm')
      .leftJoin('block.rooms', 'rooms')
      .select([
        'block.id',
        'block.number',
        'block.floor',
        'dorm',
        'rooms',
      ])
      .where('block.number ILIKE :number', {number: `%${numberSearch}%`})
      .orderBy('block.number', orderBy);

      if(floor) {
        createdQuery.andWhere('block.floor::text LIKE :floor', {floor: `%${floor}%`})
      }

      if(take && page) {
        const skip = (page-1) * take ;
        createdQuery      
          .take(take)
          .skip(skip)
      }

    const [result, total] = await  createdQuery.getManyAndCount()

    const totalPage = take && Math.ceil(total / take)

    return {
      result, 
      total,
      totalPage
    }
  }


  async createBlockSanitaryVisit(blockSanitaryVisitDto: CreateBlockSanitaryVisitDto) {
    const {blockId} = blockSanitaryVisitDto;

    const block = await this.blockRepository.findOne({where: {
      id: blockId
    }});

    if(!block) {
      throw new NotFoundException('Block doesn`t exist')
    }

    const blockSanitaryVisit = await this.blockSanitaryVisitRepository.save({
      date: blockSanitaryVisitDto.date,
      block: block,
      marks: []
    });

    blockSanitaryVisit.marks = [];

    for (let i = 0; i < allBlockSanitaryEntity.length; i++) {
      await this.blockSanitaryMarkRepository.save({
        visit: blockSanitaryVisit,
        type: allBlockSanitaryEntity[i],
        name: blockSanitaryEntityToNameMap[allBlockSanitaryEntity[i]]
      });
      
    }

    this.sendUpdateBlockTenantsMarksMessage(block.id);
    
    return this.blockSanitaryVisitRepository.findOne({
      where: {
        id: blockSanitaryVisit.id
      },
      relations: {
       marks: true,
       block: true
      }
    });
  }

  async updateBlockSanitaryVisit(updateBlockSanitaryVisit: UpdateBlockSanitaryVisitDto, id: string) {
    const blockSanitaryVisit = await this.blockSanitaryVisitRepository.findOne({
      where: { id }
    });
    
    if(!blockSanitaryVisit) {
      throw new HttpException('Visit not found', HttpStatus.NOT_FOUND)
    }

    await this.blockSanitaryVisitRepository.save({
      ...blockSanitaryVisit,
      date: updateBlockSanitaryVisit.date ?? blockSanitaryVisit.date
    })  

    this.blockSanitaryVisitRepository.findOne({where: {id: blockSanitaryVisit.id}, relations: {block: true}}).then((visit) => {
      this.sendUpdateBlockTenantsMarksMessage(visit.block.id)
    })


    return this.blockSanitaryVisitRepository.findOne({
      where: {
        id: id
      },
      relations: {
        block: true,
        marks: true
      }
    });
  }

  async updateBlockSanitaryMark(updateBlockSanitaryMark: UpdateBlockSanitaryMarkDto, id: string) {
    const blockSanitaryMark = await this.blockSanitaryMarkRepository.findOne({
      where: { id },
      relations: {
        visit: true
      }
    });
    
    if(!blockSanitaryMark) {
      throw new HttpException('Mark not found', HttpStatus.NOT_FOUND)
    }

    const mark = await this.blockSanitaryMarkRepository.save({
      ...blockSanitaryMark,
      mark: updateBlockSanitaryMark.mark || null
    })  

    this.blockSanitaryVisitRepository.findOne({where: {id: blockSanitaryMark.visit.id}, relations: {block: true}}).then((visit) => {
      this.sendUpdateBlockTenantsMarksMessage(visit.block.id)
    })

    return mark
  }

  async addUserToBlock(addUserToBlockDto: AddUserToBlockDto, id: string) {
    const user = await this.usersService.getByLogin(addUserToBlockDto.userLogin);
    
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const block = await this.blockRepository.findOne({
      where: {
        id: id 
      },
      relations: {
        tenants: true,
      }
    })

    if(!block) {
      throw new HttpException('Block not found', HttpStatus.NOT_FOUND)
    }

    block.tenants.push(user)

    return await this.blockRepository.save(block)  
  }

  async getBlockSanitaryVisits(blockId: string) {

    return this.blockSanitaryVisitRepository.find({
      where: {
        block: {
          id: blockId
        }
      },
      order: {
        date: 'ASC',
        marks: {
          type: 'ASC'
        }
      },
      relations: {
       marks: true,
       block: true
      }
    });
  }

  async deleteSanitaryVisitById(id: string) {
    const sanitaryVisit = await this.blockSanitaryVisitRepository.findOne({
      where: { id }
    });

    if(!sanitaryVisit) {
      throw new NotFoundException(`Sanitary Visit id: ${id} not found`)
    }

    await this.blockSanitaryVisitRepository.remove(sanitaryVisit)

    return;
  }

  async deleteUserFromBlock(deleteUserFromBlockDto: DeleteUserFromBlock, id: string) {
    const block = await this.blockRepository.findOne({
      where: { id },
      relations: {
        tenants: true
      }
    });

    if(!block) {
      throw new NotFoundException(`Block id: ${id} not found`)
    }

    const userToDelete = block.tenants.find((tenant) => tenant.login === deleteUserFromBlockDto.userLogin )

    if(!userToDelete) {
      throw new NotFoundException(`User: ${deleteUserFromBlockDto.userLogin} not linked to block id: ${id}`)
    }

    const newTenants =  block.tenants.filter((tenant) => tenant.login !== deleteUserFromBlockDto.userLogin );

    block.tenants = newTenants;

    const blockEntity = await this.blockRepository.save(block);

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, MessageRoute.STUDENT_UPDATE, {
      id: userToDelete.id,
      blockSanitaryConditionMark: null,
    })

    return blockEntity
  }

  private async sendUpdateBlockTenantsMarksMessage(blockId: string) {
    const block = await this.blockRepository.findOne({
      where: { id: blockId },
      relations: {
        tenants: true
      }
    });

    if(!block) return;

    block.tenants.forEach((tenant) => {
      this.updateUserAverageSanitaryVisitMark(tenant.login)
    })
  }

  private async updateUserAverageSanitaryVisitMark(userLogin: string) {
    const user = await this.usersService.getByLogin(userLogin);

    const userSanitaryVisits = await this.blockSanitaryVisitRepository.find({
      where: {
        block: {
          id: user.block.id
        }
      },
      relations: {
       marks: true,
       block: true
      }
    });

    const blockSanitaryConditionMarks = userSanitaryVisits.reduce<BlockSanitaryMark[]>((accum, visit) => [...accum, ...visit.marks.reduce((accum, mark) => {
      if(mark.mark !== null) {
        return [...accum, mark]
      }

      return accum
    }, [])], [])

    if(blockSanitaryConditionMarks.length === 0) {
      return;
    }

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, MessageRoute.STUDENT_UPDATE, {
      id: user.id,
      blockSanitaryConditionMark: blockSanitaryConditionMarks.reduce((accum, mark) => accum + mark.mark, 0) / blockSanitaryConditionMarks.length,
    })

  }
}
