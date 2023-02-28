import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { app } from 'src/main';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/createNews.dto';
import { News } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private fileService: FilesService,
    ) {

  }

  async createNews(newsDto: CreateNewsDto, image?: Express.Multer.File) {
    const news = this.newsRepository.create(newsDto);
    
    if(!image) {
      return this.newsRepository.save(news);
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      news.imageName = fileName;
      news.imageUrl = fileUrl;
    }

    return this.newsRepository.save(news);
  }

  async updateNews(newsDto: CreateNewsDto, id: string, image?: Express.Multer.File) {
    const news = await this.newsRepository.findOne({
      where: { id }
    });

    if(!news) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    if(!image) {
      return this.newsRepository.save(news);
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      news.imageName = fileName;
      news.imageUrl = fileUrl;
    }

    return this.newsRepository.save(news);
  }

  async getAll() {
    return this.newsRepository.find()
  }
}
