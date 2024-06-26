import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Response, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { Response as Res } from 'express';
import { NewsType } from './types/types';
import { Feedback } from 'src/feedback/feedback.entity';
import { CreateFeedbackDto } from 'src/feedback/dto/createFeedback.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService
  ) {

  }

  @ClassSerializer(News)
  @Post('/')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: News })
  @Roles("admin", 'worker')
  @WithRole()
  @WithAuth()
  createNews(
    @Body() newsDto: CreateNewsDto,
    @Req() { user }: RequestWithUser,
    @UploadedFiles() images?: Express.Multer.File[]
  ): Promise<News> {
    let blocks = newsDto.blocks 

    if(blocks && typeof blocks === 'string') {
      const parsedBlocks = JSON.parse(blocks);
      blocks = Array.isArray(parsedBlocks) ? parsedBlocks : [parsedBlocks]
    }
    
    return this.newsService.createNews({...newsDto, blocks: blocks}, user.login, images)
  }

  @ClassSerializer(News)
  @Put('/:id')
  @ApiParam({
    name: 'id',
  })
  @Roles("admin", 'worker')
  @WithRole()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @WithAuth()
  @ApiResponse({ type: News })
  updateNews(
    @Body() newsDto: UpdateNewsDto,
    @Param() id: string,
    @UploadedFiles() images?: Express.Multer.File[]
  ): Promise<News> {
    let blocks = newsDto.blocks 
    if(blocks && typeof blocks === 'string') {
      const parsedBlocks = JSON.parse(blocks);
      blocks = Array.isArray(parsedBlocks) ? parsedBlocks : [parsedBlocks]
    }

    return this.newsService.updateNews({...newsDto, blocks: blocks}, id, images)
  }

  @ClassSerializer(News)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "title",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "sort",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "type",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "orderBy",
    type: String,
    required: false,
  })
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  @WithAuth()
  @ApiResponse({ type: [News] })
  async getAll(
    @Req() { user }: RequestWithUser,
    @Query('ids') ids?: string[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: NewsType,
    @Query('orderBy') orderBy: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: "title" | "createdAt" = 'title',
    @Query('title') title: string = '',
    @Response() res?: Res,
    ): Promise<News[]> {
    if(ids) {
      const newsIds = Array.isArray(ids) ? ids : [ids];
      const news = await this.newsService.getAllNewsByIds(newsIds);
      res.send(news)
      return news
    }

    const {result, total, totalPage} = await this.newsService.getAll({page, limit, orderBy, sort, title, type}, user.login)
    res.set({'X-Total-Item': total })
    res.set({'X-Current-Page': page })
    res.set({'X-Total-Page': totalPage})
    res.send(result)
    return result
  }

  @ClassSerializer(News)
  @Get('/:id')
  @WithAuth()
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  @ApiResponse({ type: News })
  getById(@Param('id') login: string): Promise<News> {
    return this.newsService.getById(login)
  }

  @Delete('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  @ApiResponse({ type: News })
  deleteComment(
    @Param() id: string,
  ): Promise<News> {
    return this.newsService.deleteById(id)
  }

  @ClassSerializer(Feedback)
  @Post('/feedback')
  @ApiResponse({ type: Feedback })
  @WithAuth()
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  createFeedbackForNews(
    @Body() feedbackDto: CreateFeedbackDto,
    @Req() { user }: RequestWithUser,
  ): Promise<Feedback> {
    return this.newsService.createFeedbackForNews(feedbackDto, user.login)
  }
}
