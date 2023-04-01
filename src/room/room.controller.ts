import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Room } from './room.entity';
import { RoomService } from './room.service';

@Controller('room')
@ApiTags('Room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService
  ) {

  }

  @ClassSerializer(Room)
  @Post('/')
  @ApiResponse({ type: Room })
  createRoom(
    @Body() newsDto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomService.createRoom(newsDto)
  }

  @ClassSerializer(Room)
  @Put('/:id')
  @ApiResponse({ type: Room })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateRoom(
    @Body() blockDto: UpdateRoomDto,
    @Param() id: string,
  ): Promise<Room> {
    return this.roomService.updateRoom(blockDto, id)
  }


  @ClassSerializer(Room)
  @Get('/:id')
  @ApiResponse({ type: Room })
  getRoomById(@Param('id') name: string): Promise<Room> {
    return this.roomService.getById(name)
  }

  @ClassSerializer(Room)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @ApiResponse({ type: [Room] })
  getAllRoomsByIds(
    @Query() {ids}:  {ids?: string[]}
    ): Promise<Room[]> {
      if(!ids) {
        return this.roomService.getAll()
      }

    const roomIds = Array.isArray(ids) ? ids : [ids];
    return this.roomService.getByIds(roomIds)
  }

}
