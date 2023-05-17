import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DormsService } from 'src/dorms/dorms.service';
import { FilesService } from 'src/files/files.service';;
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { News } from './entities/news.entity';
import { NewsCodeBlock } from './entities/newsCodeBlock.entity';
import { NewsImageBlock } from './entities/newsImageBlock.entity';
import { NewsTextBlock } from './entities/newsTextBlock.entity';
import { GetAllNewsParam, NewsBlock, NewsBlockType, NewsType } from './types/types';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(NewsCodeBlock)
    private newsCodeBlockRepository: Repository<NewsCodeBlock>,
    @InjectRepository(NewsImageBlock)
    private newsImageBlockRepository: Repository<NewsImageBlock>,
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

    const news = await this.newsRepository.create({
      ...newsDto,
      author: author,
      dorm: dorm,
      blocks: undefined
    });

    news.blocks = []

    for(let i =0; i<newsDto.blocks.length; i++) {
      const blockEntity = await this.createNewsBlock(newsDto.blocks[i])
      news.blocks.push(blockEntity)
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

  async updateNews(newsDto: UpdateNewsDto, id: string, image?: Express.Multer.File) {
    const news = await this.newsRepository.findOne({
      where: { id }
    });

    if(!news) {
      throw new HttpException('News not found', HttpStatus.NOT_FOUND)
    }

    const updatedNews = this.newsRepository.create({
      ...news,
      mainText: newsDto.mainText ?? news.mainText,
      subTitle: newsDto.subTitle ?? news.subTitle,
      title: newsDto.title ?? news.title,
    }) 

    if(newsDto.blocks) {
      updatedNews.blocks = []
  
      for(let i =0; i<newsDto.blocks.length; i++) {
        const blockEntity = await this.createNewsBlock(newsDto.blocks[i])
        updatedNews.blocks.push(blockEntity)
      }
    }

    if(newsDto.dormId) {
      const dorm = await this.dormService.getById(newsDto.dormId)

      if(!dorm) {
        throw new HttpException(`Dorm ${newsDto.dormId} not found`, HttpStatus.NOT_FOUND)
      }

      updatedNews.dorm = dorm
    }


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

  async getAll(query: GetAllNewsParam) {
    const take = query.limit
    const page = query.page || 1;
    const title = query.title;
    const orderBy = query.orderBy;
    const type = query.type;
    const sort = 'news.' + query.sort;

    const createdQuery = this.newsRepository.createQueryBuilder('news')
      .leftJoin('news.author', 'author')
      .leftJoin('news.dorm', 'dorm')
      .leftJoin('news.blocks', 'blocks')
      .leftJoin('news.comments', 'comments')
      .select([
        'news.id',
        'news.title',
        'news.subTitle',
        'news.mainText',
        'news.imageName',
        'news.imageUrl',
        'news.createdAt',
        'news.type',
        'author',
        'dorm',
        'blocks',
        'comments',
      ])
      .where('news.title ILIKE :title', {title: `%${title}%`})
      .orderBy(sort, orderBy);

      if(type && type !== NewsType.ALL) {
        createdQuery.andWhere('news.type LIKE :type', {type: `%${type}%`})
      }

      if(take && page) {
        const skip = (page-1) * take ;
        createdQuery      
          .take(take)
          .skip(skip)
      }

    const [result, total] = await  createdQuery.getManyAndCount()

    const totalPage = take && Math.ceil(total / take)

    return {
      result, 
      total,
      totalPage
    }
  }

  async getAllNewsByIds(ids: string[], relations = true) {
    const news = await this.newsRepository.find({
      where: {
        id: In(ids),
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
        blocks: relations,
        dorm: relations
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

  private async createNewsBlock(block: NewsBlock, fileUrl?: string) {
    if(block.type === NewsBlockType.CODE) {
      return await this.newsCodeBlockRepository.save(block)
    }
    if(block.type === NewsBlockType.IMAGE) {
      block = block as NewsImageBlock
      block.image = 'http://localhost:3005/764c6d28-0ff2-43f8-aecc-7b3d4fc2b352.jpg'
      return await this.newsImageBlockRepository.save(block)
    }
    if(block.type === NewsBlockType.TEXT) {
      return await this.newsTextBlockRepository.save(block)
    }

  }
}
