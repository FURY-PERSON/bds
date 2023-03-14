import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateNewsDto } from './dto/createNews.dto';
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
  createNews(
    @Body() newsDto: CreateNewsDto,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<News> {
    return this.newsService.createNews(newsDto, image)
  }

  @ClassSerializer(News)
  @Put('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: News })
  updateNews(
    @Body() newsDto: CreateNewsDto,
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
