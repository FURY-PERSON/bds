import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Block } from 'src/block/entities/block.entity';
import { News } from 'src/news/entities/news.entity';

@Entity({ name: "dorm" })
export class Dorm {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  phone: string

  @ApiProperty()
  @Column({default: 100})
  reputationBound: number

  @ApiProperty()
  @Column()
  email: string

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @ApiProperty()
  @Column({nullable: true})
  imageName?: string;

  @ApiProperty()
  @Column({nullable: true})
  imageUrl?: string;

  @OneToMany(() => Block, block => block.dorm)
  block: Block[]

  @OneToMany(() => News, news => news.dorm)
  news: News[]
}