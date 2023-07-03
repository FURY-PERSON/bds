import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule
  ]
})
export class NotificationsModule {}
