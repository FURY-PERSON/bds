import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockService } from 'src/block/block.service';
import { In, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Room } from './room.entity';
import { DeleteUserFromRoom } from './dto/deleteUserFromRoom.dto';
import { AddUserToRoomDto } from './dto/addUserToRoom';
import { UsersService } from 'src/users/users.service';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';
import { MessageExchange, MessageRoute } from 'src/messageProvider/types';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private blockService: BlockService,
    private usersService: UsersService,
    private messageProvider: MessageProviderService
    ) {

  }

  async createRoom(roomDto: CreateRoomDto) {
    const {blockId} = roomDto;

    const block = await this.blockService.getById(blockId);

    if(!block) {
      throw new NotFoundException('Block doesn`t exist')
    }

    const room = this.roomRepository.create({
      ...roomDto,
      block: block
    });
    
    const roomEntity = await this.roomRepository.save(room);

    this.sendUpdateRoomMessage(roomEntity.id)

    return roomEntity
  }

  async update(roomDto: UpdateRoomDto, id: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
    });

    if(!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    const updatedRoom = this.roomRepository.create({...room, ...roomDto}) 

    if(!roomDto.blockId) {
      const roomEntity = await this.roomRepository.save(updatedRoom);  

      this.sendUpdateRoomMessage(roomEntity.id)

      return roomEntity;
    }
    
    const block = await this.blockService.getById(roomDto.blockId);

    if(!block) {
      throw new NotFoundException('Block doesn`t exist')
    }

    updatedRoom.block = block;

    const roomEntity= await this.roomRepository.save(updatedRoom);  

    this.sendUpdateRoomMessage(roomEntity.id, true)
    
    return roomEntity
  }

  async getById(id: string) {

    return this.roomRepository.findOne({
      where: {
        id: id
      },
      relations: {
        block: true,
        tenants: {
          role: true,
          featureFlags: true,
          
        }
      }
    });
  }

  async getByIds(ids?: string[]) {
    return this.roomRepository.find({
      where: {
        id: ids ? In(ids) : undefined,
      },
      relations: {
        block: true,
        tenants: true
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

  async addUserToRoom(addUserToRoomDto: AddUserToRoomDto, id: string) {
    const user = await this.usersService.getByLogin(addUserToRoomDto.userLogin);
    
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    
    const room = await this.roomRepository.findOne({
      where: {
        id: id 
      },
      relations: {
        tenants: true,
        block: true
      }
    })

    if(!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    if(user.room) {
      throw new HttpException(`User already linked to room id: ${user.room.id}.`, HttpStatus.BAD_REQUEST)
    }

    if(user.block) {
      throw new HttpException(`User already linked to block id ${user.block.id}.`, HttpStatus.BAD_REQUEST)
    }

    if(room.tenants.length + 1 > room.peopleAmount) {
      throw new HttpException('Can not add user because room is full.', HttpStatus.BAD_REQUEST)
    }

    room.tenants.push(user)

    const block = await this.blockService.getById(room.block.id);

    if(!block) {
      throw new HttpException(`There is no connected block for room :${room.id}`, HttpStatus.NOT_FOUND)
    }
    
    const userInBlock = block.tenants.find((tenant) => tenant.login === user.login)

    if(!userInBlock) {
      const updateBlock = await this.blockService.addUserToBlock({userLogin: user.login}, block.id)
      room.block = updateBlock;
    }

    return await this.roomRepository.save(room)  
  }


  async deleteUserFromRoom(deleteUserFromRoomDto: DeleteUserFromRoom, id?: string) {
    const user = await this.usersService.getByLogin(deleteUserFromRoomDto.userLogin)

    if(!user) {
      throw new NotFoundException(`User ${deleteUserFromRoomDto.userLogin} not found`)
    }

    if(!id) {
      await this.blockService.deleteUserFromBlock({userLogin: deleteUserFromRoomDto.userLogin}, user.block.id).catch(() => {})
      return;
    }


    const room = await this.roomRepository.findOne({
      where: { id },
      relations: {
        tenants: true,
        block: true
      }
    });

    if(!room) {
      throw new NotFoundException(`Room id: ${id} not found`)
    }

    const userToDelete = room.tenants.find((tenant) => tenant.login === deleteUserFromRoomDto.userLogin)

    if(!userToDelete) {
      throw new NotFoundException(`User: ${deleteUserFromRoomDto.userLogin} not linked to room id: ${id}`)
    }

    const newTenants = room.tenants.filter((tenant) => tenant.login !== deleteUserFromRoomDto.userLogin);

    room.tenants = newTenants;

    await this.blockService.deleteUserFromBlock({userLogin: deleteUserFromRoomDto.userLogin}, room.block.id);

    return await this.roomRepository.save(room)
  }

  private async sendUpdateRoomMessage(roomId: string, update?: boolean) {
    const room = await this.roomRepository.findOne({where: {id: roomId}, relations: {block: true}});

    if(!room) return;

    const block = await this.blockService.getById(room.block.id);

    if(!block) return;

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, update ? MessageRoute.ROOM_UPDATE :  MessageRoute.ROOM_CREATE, {
      id: room.id,
      blockId: block.id,
      capacity: room.peopleAmount,
      dormId: block.dorm.id,
      number: room.number,
      subNumber: room.subNumber
    })
  }
}
