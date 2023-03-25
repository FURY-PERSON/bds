import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchController } from './watch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watch } from './watch.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [WatchService],
  controllers: [WatchController],
  imports: [
    TypeOrmModule.forFeature([Watch]),
    UsersModule
  ]
})
export class WatchModule {}
