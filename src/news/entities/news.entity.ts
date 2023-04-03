import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { Dorm } from 'src/dorms/dorms.entity';
import { NewsBlock, NewsType } from '../types/types';
import { IsEnum } from 'class-validator';
import { NewsBlockBase } from './newsBlockBase.entity';

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
}