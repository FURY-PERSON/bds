import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApplySettlementDto } from './dto/applySettlement.dto';
import { UsersService } from 'src/users/users.service';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class SettlementService {
  constructor(
    private usersService: UsersService,
    private roomService: RoomService,
    ) {

  }

  async applySettlement(settlementDto: ApplySettlementDto) {
    const usersInDorm = await this.usersService.getAllByDorm(settlementDto.dormId);

    const deletionPromises = usersInDorm?.map((userInDorm) => this.roomService.deleteUserFromRoom({userLogin: userInDorm.login}, userInDorm.room?.id))

    await Promise.allSettled(deletionPromises);

    const settlementPromises = settlementDto.students.filter((user) => !user.rejected)
      ?.map(async (user) => {
        const userFromServer = await this.usersService.getById(user.id);

        if(!userFromServer) {
          new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        await this.roomService.addUserToRoom({userLogin: userFromServer.login}, user.roomId)
      })

    await Promise.all(settlementPromises);

    return;
  }
}
