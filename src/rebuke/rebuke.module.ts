import { Module } from '@nestjs/common';
import { RebukeController } from './rebuke.controller';
import { RebukeService } from './rebuke.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rebuke } from './entities/rebuke.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  controllers: [RebukeController],
  providers: [RebukeService, MessageProviderService],
  imports: [
    TypeOrmModule.forFeature([Rebuke]),
    UsersModule
  ]
})
export class RebukeModule {}
