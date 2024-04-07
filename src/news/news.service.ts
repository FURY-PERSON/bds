import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
import { FeedbackService } from 'src/feedback/feedback.service';
import { CreateFeedbackDto } from 'src/feedback/dto/createFeedback.dto';
import { Role } from 'src/roles/roles.entity';
import { Roles } from 'src/roles/types';

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
    private feedbackService: FeedbackService,
    ) {

  }

  async createNews(newsDto: CreateNewsDto, authorLogin: string, images?: Express.Multer.File[]) {
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

    const mainImage = images.find((image) => image.fieldname == 'mainImage') as Express.Multer.File | undefined

    for(let i =0; i<newsDto.blocks.length; i++) {
      const block = newsDto.blocks[i];

      const blockImage = images.find((image) => image.fieldname == String(block.sequenceNumber))  as Express.Multer.File | undefined

      if(blockImage) {
        const {fileUrl} = await this.fileService.createFile(blockImage);
        const blockEntity = await this.createNewsBlock(block, fileUrl)
        news.blocks.push(blockEntity)
      } else {
        const blockEntity = await this.createNewsBlock(block)
        news.blocks.push(blockEntity)
      }
    }

    if(mainImage) {
      const {fileName, fileUrl} = await this.fileService.createFile(mainImage);
      if(fileName && fileUrl) {
        news.imageName = fileName;
        news.imageUrl = fileUrl;
      }
    }

    return this.newsRepository.save(news);
  }

  async updateNews(newsDto: UpdateNewsDto, id: string, images?: Express.Multer.File[]) {
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
        const block = newsDto.blocks[i];
  
        const blockImage = images.find((image) => image.fieldname == String(block.sequenceNumber))  as Express.Multer.File | undefined
  
        if(blockImage) {
          const {fileUrl} = await this.fileService.createFile(blockImage);
          const blockEntity = await this.createNewsBlock(block, fileUrl)
          updatedNews.blocks.push(blockEntity)
        } else {
          const blockEntity = await this.createNewsBlock(block)
          updatedNews.blocks.push(blockEntity)
        }
      }
    }

    if(newsDto.dormId) {
      const dorm = await this.dormService.getById(newsDto.dormId)

      if(!dorm) {
        throw new HttpException(`Dorm ${newsDto.dormId} not found`, HttpStatus.NOT_FOUND)
      }

      updatedNews.dorm = dorm
    }

    const mainImage = images.find((image) => image.fieldname == 'mainImage') as Express.Multer.File | undefined

    if(mainImage) {
      const {fileName, fileUrl} = await this.fileService.createFile(mainImage);
      if(fileName && fileUrl) {
        news.imageName = fileName;
        news.imageUrl = fileUrl;
      }
    }
    
    return this.newsRepository.save(updatedNews);
  }

  async getAll(query: GetAllNewsParam, userLogin: string) {
    const take = query.limit
    const page = query.page || 1;
    const title = query.title;
    const orderBy = query.orderBy;
    const type = query.type;
    const sort = 'news.' + query.sort;

    const user = await this.userService.getByLogin(userLogin, true);

    if(!user) {
      throw new NotFoundException('User doesn`t exist')
    }

    const createdQuery = this.newsRepository.createQueryBuilder('news')
      .leftJoin('news.author', 'author')
      .leftJoin('news.dorm', 'dorm')
      .leftJoin('news.blocks', 'blocks')
      .leftJoin('news.comments', 'comments')
      .leftJoin('news.feedbacks', 'feedbacks')
      .select([
        'news.id',
        'news.title',
        'news.subTitle',
        'news.mainText',
        'news.imageName',
        'news.imageUrl',
        'news.createdAt',
        'news.type',
        'news.rating',
        'author',
        'dorm',
        'blocks',
        'comments',
      ])
      .where('news.title ILIKE :title', {title: `%${title}%`})
      .orderBy(sort, orderBy);

      if(user.role?.name === Roles.ADMIN) {
        createdQuery.addSelect('feedbacks')
      }

      if(type && type !== NewsType.ALL) {
        createdQuery.andWhere('news.type LIKE :type', {type: `%${type}%`})
      }

      if(take && page) {
        const skip = (page-1) * take ;
        createdQuery      
          .take(take)
          .skip(skip)
      }


    const [result, total] = await createdQuery.getManyAndCount();

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
        dorm: relations,
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
      block.image = fileUrl
      return await this.newsImageBlockRepository.save(block)
    }
    if(block.type === NewsBlockType.TEXT) {
      return await this.newsTextBlockRepository.save(block)
    }

  }

  async createFeedbackForNews(feedbackDto: CreateFeedbackDto, authorLogin: string) {
    const {relatedEntityId} = feedbackDto;
    const news = await this.newsRepository.findOne({
      where: {
        id: relatedEntityId
      }
    });

    if(!news) {
      throw new NotFoundException(`News with id ${news} doesn't exist`)
    }

    const author = await this.userService.getByLogin(authorLogin, false);

    if(!author) {
      throw new NotFoundException('User doesn`t exist')
    }

    const isAlreadyFeedback = await this.feedbackService.getUserFeedbacksByNewsId(news.id, author.login)

    if(isAlreadyFeedback.length !== 0) {
      throw new BadRequestException('You can not give feedback more than once.')
    }

    const createdFeedback = await this.feedbackService.createNewsFeedback(feedbackDto, author, news)

    this.feedbackService.getRelatedEntityRating(news.id).then((rating: number) => {
      news.rating = rating;
      this.newsRepository.save(news)
    })

    return createdFeedback
  }
}
