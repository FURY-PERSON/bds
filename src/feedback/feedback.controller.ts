import { Body, Controller, Delete, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { UpdateFeedbackDto } from './dto/updateFeedback.dto';


@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService
  ) {

  }

  @ClassSerializer(Feedback)
  @Put('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Feedback })
  updateComment(
    @Body() feedbackDto: UpdateFeedbackDto,
    @Param() id: string,
  ): Promise<Feedback> {
    return this.feedbackService.updateComment(feedbackDto, id)
  }

  @ClassSerializer(Feedback)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @WithAuth()
  @ApiResponse({ type: [Feedback] })
  getAll(
    @Query('ids') ids?: string[]
  ): Promise<Feedback[]> {
    if(!ids) {
      return this.feedbackService.getAll()
    }

    const commentIds = Array.isArray(ids) ? ids : [ids];
    return this.feedbackService.getAllFeedbacksByIds(commentIds);
  }

  @ClassSerializer(Feedback)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: Feedback })
  getById(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.getById(id)
  }

  @ClassSerializer(Feedback)
  @Get('/news/:id')
  @WithAuth()
  @ApiResponse({ type: Feedback })
  getAllByNewsId(@Param('id') id: string): Promise<Feedback[]> {
    return this.feedbackService.getAllFeedbacksByNewsId(id)
  }

  @ClassSerializer(Feedback)
  @Get('/news/:id/user')
  @WithAuth()
  @ApiResponse({ type: Feedback })
  getUserFeedbackByMewsId(
    @Param('id') id: string,
    @Req() { user }: RequestWithUser,
    ): Promise<Feedback[]> {
    return this.feedbackService.getUserFeedbacksByNewsId(id, user.login)
  }

  @Delete('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Feedback })
  deleteComment(
    @Param() id: string,
  ): Promise<Feedback> {
    return this.feedbackService.deleteById(id)
  }
}
