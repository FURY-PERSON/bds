import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';


@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {

  }

  @ClassSerializer(Comment)
  @Post('/news')
  @ApiResponse({ type: Comment })
  @WithAuth()
  createCommentForNews(
    @Body() commentDto: CreateCommentDto,
    @Req() { user }: RequestWithUser,
  ): Promise<Comment> {
    return this.commentService.createCommentForNews(commentDto, user.login)
  }

  @ClassSerializer(Comment)
  @Put('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Comment })
  updateComment(
    @Body() commentDto: UpdateCommentDto,
    @Param() id: string,
  ): Promise<Comment> {
    return this.commentService.updateComment(commentDto, id)
  }

  @ClassSerializer(Comment)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @WithAuth()
  @ApiResponse({ type: [Comment] })
  getAll(
    @Query('ids') ids?: string[]
  ): Promise<Comment[]> {
    if(!ids) {
      return this.commentService.getAll()
    }

    const commentIds = Array.isArray(ids) ? ids : [ids];
    return this.commentService.getAllCommentByIds(commentIds);
  }

  @ClassSerializer(Comment)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: Comment })
  getById(@Param('id') login: string): Promise<Comment> {
    return this.commentService.getById(login)
  }

  @Delete('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: Comment })
  deleteComment(
    @Param() id: string,
  ): Promise<Comment> {
    return this.commentService.deleteById(id)
  }
}
