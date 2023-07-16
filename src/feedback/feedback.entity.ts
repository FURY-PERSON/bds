import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { News } from "src/news/entities/news.entity";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "feedback" })
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  rating: number;

  @ApiProperty({nullable: true})
  @Column({nullable: true})
  text: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @ManyToOne(() => News, news => news.feedbacks)
  @JoinColumn()
  news: News;

  @ManyToOne(() => User, user => user.feedbacks)
  @JoinColumn()
  author: User;
}