import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { FilesService } from 'src/files/files.service';
import { QueryParam } from 'src/types/queryParam';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './entities/news.entity';
import { NewsCodeBlock } from './entities/newsCodeBlock.entity';
import { NewsImageBlock } from './entities/newsImageBlock.entity';
import { NewsTextBlock } from './entities/newsTextBlock.entity';
import { NewsBlock, NewsBlockType } from './types/types';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(NewsCodeBlock)
    private newsCodeBlockRepository: Repository<NewsCodeBlock>,
    @InjectRepository(NewsImageBlock)
    private newsCodeImageRepository: Repository<NewsImageBlock>,
    @InjectRepository(NewsTextBlock)
    private newsTextBlockRepository: Repository<NewsTextBlock>,
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

    const news = await this.newsRepository.save({
      ...newsDto,
      author: author,
      dorm: dorm,
      blocks: undefined
    });
    
    newsDto.blocks.forEach(async (block) => {
      news.blocks = []
      block.news = news;
      const blockEntity = await this.createNewsBlock(block)
      news.blocks.push(blockEntity)
    })
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
    
    const updatedNews = await this.newsRepository.save({...news, ...newsDto}) 

    newsDto.blocks.forEach(async (block) => {
      updatedNews.blocks = []
      block.news = updatedNews;
      const blockEntity = await this.createNewsBlock(block)
      updatedNews.blocks.push(blockEntity)
    })

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

  async getAll(query: QueryParam) {
    const take = query.limit || 20
    const page = query.page || 1;
    const skip = (page-1) * take ;

    const [result, total] = await this.newsRepository.findAndCount({
      relations: {
        author: true,
        blocks: true
      },
      take: take,
      skip: skip
    })

    const totalPage = Math.ceil(total / take)

    return {
      result, 
      total,
      totalPage
    }
  }

  async getAllNewsByIds(ids: string[], relations = true) {
    const news = await this.newsRepository.find({
      where: {
        id: In(ids)
      },
      relations: {
        author: relations,
        blocks: relations
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
        blocks: relations
      }
    });
    
    return news;
  }

  async deleteById(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id }
    });

    if(!news) {
      throw new NotFoundException(`News id: ${id} not found`)
    }

    return await this.newsRepository.remove(news)
  }

  private async createNewsBlock(block: NewsBlock) {
    switch(block.type) {
      case NewsBlockType.CODE: {
        return await this.newsCodeBlockRepository.save(block)
      }
      case NewsBlockType.IMAGE: {
        return await this.newsCodeImageRepository.save(block)
      }
      case NewsBlockType.TEXT: {
        return await this.newsTextBlockRepository.save(block)
      }
    }

  }
}
