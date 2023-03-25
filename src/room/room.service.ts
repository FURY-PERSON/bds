import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockService } from 'src/block/block.service';
import { In, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private blockService: BlockService,
    ) {

  }

  async createRoom(roomDto: CreateRoomDto) {
    const {blockId} = roomDto;

    const block = await this.blockService.getById(blockId);

    if(!block) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const room = this.roomRepository.create({
      ...roomDto,
      block: block
    });
    
    return this.roomRepository.save(room);
  }

  async updateRoom(roomDto: UpdateRoomDto, id: string) {
    const room = await this.roomRepository.findOne({
      where: { id }
    });

    if(!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    const updatedRoom = this.roomRepository.create({...room, ...roomDto}) 

    if(!roomDto.blockId) {
      return this.roomRepository.save(updatedRoom);  
    }
    
    const block = await this.blockService.getById(roomDto.blockId);

    if(!block) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    updatedRoom.block = block;

    return this.roomRepository.save(updatedRoom);  
  }

  async getById(id: string) {

    return this.roomRepository.findOne({
      where: {
        id: id
      },
      relations: {
        block: true
      }
    });
  }

  async getByIds(ids?: string[]) {
    return this.roomRepository.find({
      where: {
        id: ids ? In(ids) : undefined,
      },
      relations: {
        block: true
      }
    });
  }

  async getAll() {
    return this.roomRepository.find({
      relations: {
        block: true
      }
    })
  }
}
