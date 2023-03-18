import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './news.entity';
import { NewsService } from './news.service';

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
    return this.newsService.createNews(newsDto, user.login, image)
  }

  @ClassSerializer(News)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
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
  @ApiResponse({ type: [News] })
  getAll(): Promise<News[]> {
    return this.newsService.getAll()
  }
}
