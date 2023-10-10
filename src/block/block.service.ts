import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { In, Repository } from 'typeorm';
import { CreateBlockDto } from './dto/createBlock.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';
import { Block } from './entities/block.entity';
import { GetAllBlocksParam } from './types/types';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private dormService: DormsService,
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
        rooms: true
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
}
