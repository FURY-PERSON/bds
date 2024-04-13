import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { UsersModule } from 'src/users/users.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  controllers: [SettlementController],
  providers: [SettlementService],
  imports: [
    UsersModule,
    RoomModule
  ]
})
export class SettlementModule {}
