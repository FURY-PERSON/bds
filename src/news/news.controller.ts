import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { Response as Res } from 'express';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService
  ) {

  }

  @ClassSerializer(News)
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: News })
  @WithAuth()
  createNews(
    @Body() newsDto: CreateNewsDto,
    @Req() { user }: RequestWithUser,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<News> {
    let blocks = newsDto.blocks 
    if(blocks && typeof blocks === 'string') {
      const parsedBlocks = JSON.parse(blocks);
      blocks = Array.isArray(parsedBlocks) ? parsedBlocks : [parsedBlocks]
    }
    
    return this.newsService.createNews({...newsDto, blocks: blocks}, user.login, image)
  }

  @ClassSerializer(News)
  @Put('/:id')
  @ApiParam({
    name: 'id',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @WithAuth()
  @ApiResponse({ type: News })
  updateNews(
    @Body() newsDto: UpdateNewsDto,
    @Param() id: string,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<News> {
    return this.newsService.updateNews(newsDto, id, image)
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
  @WithAuth()
  @ApiResponse({ type: [News] })
  async getAll(
    @Query('ids') ids?: string[],
    @Query('page') page?:  number,
    @Query('limit') limit?: number,
    @Response() res?: Res
    ): Promise<News[]> {
    if(!ids) {
      const {result, total, totalPage} = await this.newsService.getAll({page, limit})
      res.set({'X-Total-Item': total })
      res.set({'X-Current-Page': page })
      res.set({'X-Total-Page': totalPage})
      res.send(result)

    }
    const newsIds = Array.isArray(ids) ? ids : [ids];
    return this.newsService.getAllNewsByIds(newsIds);
  }

  @ClassSerializer(News)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: News })
  getById(@Param('id') login: string): Promise<News> {
    return this.newsService.getById(login)
  }

  @Delete('/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({ type: News })
  deleteComment(
    @Param() id: string,
  ): Promise<News> {
    return this.newsService.deleteById(id)
  }
}
