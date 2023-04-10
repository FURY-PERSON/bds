import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { In, Repository } from 'typeorm';
import { CreateBlockDto } from './dto/createBlock.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';
import { Block } from './entities/block.entity';

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
        dorm: true
      }
    });
  }

  async getByIds(ids?: string[]) {
    return this.blockRepository.find({
      where: {
        id: ids ? In(ids) : undefined,
      },
      relations: {
        dorm: true
      }
    });
  }

  async getAll() {
    return this.blockRepository.find({
      relations: {
        dorm: true
      }
    })
  }
}
