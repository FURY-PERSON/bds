import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { WithPermission } from 'src/decorators/withPermission';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Room } from './room.entity';
import { RoomService } from './room.service';
import { AddUserToRoomDto } from './dto/addUserToRoom';
import { DeleteUserFromRoom } from './dto/deleteUserFromRoom.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';

@Controller('room')
@ApiTags('Room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService
  ) {

  }

  @ClassSerializer(Room)
  @Post('/')
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Room })
  createRoom(
    @Body() newsDto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomService.createRoom(newsDto)
  }

  @ClassSerializer(Room)
  @Put('/:id')
  @WithAuth()
  @ApiResponse({ type: Room })
  @Roles("admin", 'worker')
  @WithRole()
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
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Room })
  getRoomById(@Param('id') name: string): Promise<Room> {
    return this.roomService.getById(name)
  }

  @ClassSerializer(Room)
  @Get('/')
  @WithAuth()
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @Roles("admin", 'worker')
  @WithRole()
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


  @ClassSerializer(Room)
  @Put('/user/:id')
  @WithAuth()
  @ApiResponse({ type: Room })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  @Roles("admin", 'worker')
  @WithRole()
  addUserToBlock(
    @Body() blockSanitaryVisitDto: AddUserToRoomDto,
    @Param() id: string,
  ): Promise<Room> {
    return this.roomService.addUserToRoom(blockSanitaryVisitDto, id)
  }

  @ClassSerializer(Room)
  @Delete('/user/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Room })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  deleteUserFromBlock(
    @Body() blockSanitaryVisitDto: DeleteUserFromRoom,
    @Param() id: string,
  ): Promise<Room> {
    return this.roomService.deleteUserFromRoom(blockSanitaryVisitDto, id)
  }
}
