import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { BlockModule } from 'src/block/block.module';
import { UsersModule } from 'src/users/users.module';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  providers: [RoomService, MessageProviderService],
  controllers: [RoomController],
  imports: [
    TypeOrmModule.forFeature([Room]),
    BlockModule,
    UsersModule
  ],
  exports: [RoomService]
})
export class RoomModule {}
