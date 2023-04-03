import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { NewsBlockType } from "../types/types";
import { News } from "./news.entity";

@Entity('newsBlockBase')
@TableInheritance({ column: { type: "varchar" } })
export abstract class NewsBlockBase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: NewsBlockType

  @ManyToOne(() => News, news => news.blocks)
  news: News
}