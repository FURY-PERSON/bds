import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsService } from 'src/news/news.service';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private userService: UsersService,
    private newsService: NewsService,
    ) {

  }

  async createCommentForNews(commentDto: CreateCommentDto, authorLogin: string) {
    const {relatedEntityId} = commentDto;
    const news = await this.newsService.getById(relatedEntityId);

    if(!news) {
      throw new NotFoundException(`News with id ${news} doesn't exist`)
    }

    const author = await this.userService.getByLogin(authorLogin, false);

    if(!author) {
      throw new NotFoundException('User doesn`t exist')
    }

    const createdComment = this.commentRepository.create(commentDto)

    createdComment.author = author;
    createdComment.news = news

    return this.commentRepository.save(createdComment);
  }

  async updateComment(commentDto: UpdateCommentDto, id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id }
    });

    if(!comment) {
      throw new NotFoundException(`Comment id: ${comment} not found`)
    }
    
    const updatedComment = await this.commentRepository.save({...comment, ...commentDto}) 

    return this.commentRepository.save(updatedComment);
  }

  async getAll() {
    return this.commentRepository.find({
      relations: {
        author: true,
      },
    })
  }

  async getAllCommentByIds(ids: string[], relations = true) {
    const comment = await this.commentRepository.find({
      where: {
        id: In(ids)
      },
      relations: {
        author: relations,
      },
    });
    return comment;
  }

  async getAllCommentByNewsIds(newsId: string, relations = true) {
    const comment = await this.commentRepository.find({
      where: {
        news: {
          id: newsId
        }
      },
      relations: {
        author: relations,
      },
    });
    return comment;
  }

  async getById(id: string, relations = true) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: id
      },
      relations: {
        author: relations,
      }
    });
    
    return comment;
  }

  async deleteById(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id }
    });

    if(!comment) {
      throw new NotFoundException(`Comment id: ${id} not found`)
    }

    return await this.commentRepository.remove(comment)
  }
}
