import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { Dorm } from 'src/dorms/dorms.entity';
import { NewsBlock, NewsType } from '../types/types';
import { IsEnum } from 'class-validator';
import { NewsBlockBase } from './newsBlockBase.entity';
import { Comment } from 'src/comment/comment.entity';
import { Feedback } from 'src/feedback/feedback.entity';

@Entity({ name: "news" })
export class News {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  subTitle: string;

  @ApiProperty()
  @Column()
  mainText: string;

  @ApiProperty()
  @Column({nullable: true})
  imageName?: string;

  @ApiProperty()
  @Column({nullable: true})
  imageUrl?: string;

  @ManyToOne(() => User, user => user.news)
  author: User

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  @IsEnum(NewsType)
  type:NewsType;

  @ManyToOne(() => Dorm, dorm => dorm.news)
  @JoinColumn()
  dorm: Dorm;

  @OneToMany(() => NewsBlockBase, blocks => blocks.news)
  @JoinColumn()
  blocks: Array<NewsBlock>

  @OneToMany(() => Comment, comment => comment.news, {onDelete: 'CASCADE'})
  @JoinColumn()
  comments: Array<Comment>

  @OneToMany(() => Feedback, feedback => feedback.news)
  @JoinColumn()
  feedbacks: Array<Feedback>

  @Column({
    nullable: true,
    type: 'decimal'
  })
  rating?: number
}