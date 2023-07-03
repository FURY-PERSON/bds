import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { Notification } from "./notification.entity";
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UsersService,
    ) {

  }

  async createNotification(notificationDto: CreateNotificationDto, authorLogin: string) {
    const author = await this.userService.getByLogin(authorLogin, false);

    if(!author) {
      throw new NotFoundException('User doesn`t exist')
    }

    const createdNotification = this.notificationRepository.create(notificationDto)

    createdNotification.author = author;

    const users = await this.userService.getAllWithoutFilters();

    createdNotification.users = users;
    createdNotification.readedUsers = [];

    return this.notificationRepository.save(createdNotification);
  }

  async updateNotification(notificationDto: UpdateNotificationDto, id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id }
    });

    if(!notification) {
      throw new NotFoundException(`Notification id: ${id} not found`)
    }
    
    const updatedNotification = this.notificationRepository.create({
      ...notification,
      title: notificationDto.title ?? notification.title,
      subTitle: notificationDto.subTitle ?? notification.subTitle,
      mainText: notificationDto.mainText ?? notification.mainText,
    }) 
 
    return this.notificationRepository.save(updatedNotification);
  }

  async getAll() {
    return this.notificationRepository.find({
      relations: {
        author: true,
        readedUsers: true
      },
    })
  }

  async getById(id: string, userLogin: string) {
    const user = await this.userService.getByLogin(userLogin, false);

    const notification = await this.notificationRepository.findOne({
      where: {
        id: id
      },
      relations: {
        author: true,
        readedUsers: true
      }
    });
    await this.markAsRead(user, notification);

    return notification;
  }

  async getByUserLogin(userLogin: string) {
    const user = await this.userService.getByLogin(userLogin, false);

    const notifications = await this.notificationRepository.createQueryBuilder('notifications')
    .leftJoinAndSelect('notifications.users', 'users')
    .where('users.login = :login', { login: user.login })
    .leftJoin('notifications.author', 'author')
    .leftJoin('notifications.readedUsers', 'readedUsers')
    .select([
      'notifications.id',
      'notifications.title',
      'notifications.subTitle',
      'notifications.mainText',
      'notifications.createdAt',
      'notifications.updatedAt',
      'notifications.link',
      'users',
      'author',
      'readedUsers'
    ])
    .orderBy('notifications.createdAt', 'DESC')
    .getMany()

    return notifications.map((notification) => {
      notification.readed = !!notification.readedUsers?.find((readUser) => readUser.login === user.login)
      return notification
    });
  }

  async deleteById(id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id }
    });

    if(!notification) {
      throw new NotFoundException(`Notification id: ${id} not found`)
    }

    return await this.notificationRepository.remove(notification)
  }

  private async markAsRead(user: User, notification: Notification) {
    console.log('rrr', notification)
    if(Array.isArray(notification.readedUsers)) {
      notification.readedUsers.push(user);
    } else {
      notification.readedUsers = [user]
    }
    console.log('readed', notification)
    return this.notificationRepository.save(notification)
  }
}
