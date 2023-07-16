import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsService } from 'src/news/news.service';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/createFeedback.dto';
import { UpdateFeedbackDto } from './dto/updateFeedback.dto';
import { User } from 'src/users/entities/users.entity';
import { News } from 'src/news/entities/news.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private userService: UsersService,
    ) {

  }

  async createNewsFeedback(feedback: CreateFeedbackDto, author: User, news: News) {
    const createdFeedback = this.feedbackRepository.create(feedback)
    createdFeedback.author = author;
    createdFeedback.news = news;
    return this.feedbackRepository.save(createdFeedback)
  }

  async updateComment(feedbackDto: UpdateFeedbackDto, id: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id }
    });

    if(!feedback) {
      throw new NotFoundException(`Feedback id: ${id} not found`)
    }
    
    const updatedComment = this.feedbackRepository.create({
      ...feedback,
      rating: feedbackDto.rating ?? feedback.rating,
      text: feedbackDto.text ?? feedback.text,
    }) 
 

    return this.feedbackRepository.save(updatedComment);
  }

  async getAll() {
    return this.feedbackRepository.find({
      relations: {
        author: true,
      },
    })
  }

  async getAllFeedbacksByIds(ids: string[], relations = true) {
    const feedback = await this.feedbackRepository.find({
      where: {
        id: In(ids)
      },
      relations: {
        author: relations,
      },
    });
    return feedback;
  }

  async getAllFeedbacksByNewsId(newsId: string, relations = true) {
    const feedback = await this.feedbackRepository.find({
      where: {
        news: {
          id: newsId
        }
      },
      relations: {
        author: relations,
      },
    });
    return feedback;
  }

  async getUserFeedbacksByNewsId(newsId: string, authorLogin: string) {
    const author = await this.userService.getByLogin(authorLogin, false);

    if(!author) {
      throw new NotFoundException('User doesn`t exist')
    }

    const feedback = await this.feedbackRepository.find({
      where: {
        news: {
          id: newsId
        },
        author: {
          login: author.login
        }
      }
    });
    return feedback;
  }

  async getById(id: string, relations = true) {
    const feedback = await this.feedbackRepository.findOne({
      where: {
        id: id
      },
      relations: {
        author: relations,
      }
    });
    
    return feedback;
  }

  async deleteById(id: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id }
    });

    if(!feedback) {
      throw new NotFoundException(`Feedback id: ${id} not found`)
    }

    return await this.feedbackRepository.remove(feedback)
  }

  async getRelatedEntityRating(id: string) {
    const feedbacks = await this.feedbackRepository.find({
      where: { 
        news: {
          id: id
        }
       }
    });

    if(!feedbacks) {
      throw new NotFoundException(`Feedbacks for entity id: ${id} not found`)
    }

    if(feedbacks.length === 0) return undefined

    return +(feedbacks.reduce((accum, feedback) => accum + feedback.rating, 0) / feedbacks.length).toFixed(2)
  }
}
