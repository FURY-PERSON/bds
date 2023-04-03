import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private fileService: FilesService,
    private dormService: DormsService,
    private userService: UsersService,
    ) {

  }

  async createNews(newsDto: CreateNewsDto, authorLogin: string, image?: Express.Multer.File) {
    const {dormId} = newsDto;
    const dorm = await this.dormService.getById(dormId);

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const author = await this.userService.getByLogin(authorLogin, false);

    if(!author) {
      throw new NotFoundException('User doesn`t exist')
    }

    const news = this.newsRepository.create({
      ...newsDto,
      author: author,
      dorm: dorm
    });

    
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

  async updateNews(newsDto: UpdateNewsDto, id: string, image?: Express.Multer.File) {
    const news = await this.newsRepository.findOne({
      where: { id }
    });

    if(!news) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    
    const updatedNews = this.newsRepository.create({...news, ...newsDto}) 

    if(!image) {
      return this.newsRepository.save(updatedNews);
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      updatedNews.imageName = fileName;
      updatedNews.imageUrl = fileUrl;
    }

    return this.newsRepository.save(updatedNews);
  }

  async getAll() {
    return this.newsRepository.find({
      relations: {
        author: true,
      },
    })
  }

  async getAllNewsByIds(ids: string[], relations = true) {
    const news = await this.newsRepository.find({
      where: {
        id: In(ids)
      },
      relations: {
        author: relations,
      },
    });
    return news;
  }

  async getById(id: string, relations = true) {
    const news = await this.newsRepository.findOne({
      where: {
        id: id
      },
      relations: {
        author: relations,
      }
    });
    
    return news;
  }

  
}
