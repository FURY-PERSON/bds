import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { News } from "src/news/entities/news.entity";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "comment" })
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({nullable: true})
  @Column({nullable: true})
  title: string;

  @ApiProperty({nullable: true})
  @Column({nullable: true})
  subTitle: string;

  @ApiProperty()
  @Column()
  mainText: string;

  @ManyToOne(() => User, user => user.news)
  author: User

  @ManyToOne(() => User, user => user.likers)
  @Exclude()
  likers: User[]

  @ManyToOne(() => User, user => user.dislikers)
  @Exclude()
  dislikers: User[]

  @ApiProperty()
  @Column({nullable: true})
  rating?: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => News, news => news.comments)
  @JoinColumn()
  news: News;
}