import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import { UpdateNotificationDto } from './dto/updateNotification.dto';
import { CreateNotificationDto } from './dto/createNotification.dto';


@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService
  ) {

  }

  @ClassSerializer(Notification)
  @Post('')
  @ApiResponse({ type: Notification })
  @WithAuth()
  createCommentForNews(
    @Body() commentDto: CreateNotificationDto,
    @Req() { user }: RequestWithUser,
  ): Promise<Notification> {
    return this.notificationService.createNotification(commentDto, user.login)
  }

  @ClassSerializer(Notification)
  @Put('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Notification })
  updateComment(
    @Body() notificationDto: UpdateNotificationDto,
    @Param() id: string,
  ): Promise<Notification> {
    return this.notificationService.updateNotification(notificationDto, id)
  }

  @ClassSerializer(Notification)
  @Get('/all')
  @WithAuth()
  @ApiResponse({ type: [Notification] })
  getAll(): Promise<Notification[]> {
    return this.notificationService.getAll()
  }

  @ClassSerializer(Notification)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: Notification })
  getById(
    @Param('id') id: string,
    @Req() { user }: RequestWithUser,
    ): Promise<Notification> {
    return this.notificationService.getById(id, user.login)
  }

  @ClassSerializer(Notification)
  @Get()
  @WithAuth()
  @ApiResponse({ type: [Notification] })
  getByLogin(
    @Req() { user }: RequestWithUser,
    ): Promise<Notification[]> {
    return this.notificationService.getByUserLogin(user.login)
  }

  @Delete('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Notification })
  deleteComment(
    @Param() id: string,
  ): Promise<Notification> {
    return this.notificationService.deleteById(id)
  }
}
