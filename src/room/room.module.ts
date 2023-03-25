import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { BlockModule } from 'src/block/block.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [
    TypeOrmModule.forFeature([Room]),
    BlockModule,
  ]
})
export class RoomModule {}
