import { QueryParam } from "src/types/queryParam";
import { NewsCodeBlock } from "../entities/newsCodeBlock.entity";
import { NewsImageBlock } from "../entities/newsImageBlock.entity";
import { NewsTextBlock } from "../entities/newsTextBlock.entity";

export enum NewsBlockType {
  IMAGE = 'NewsImageBlock',
  TEXT = 'NewsTextBlock',
  CODE = 'NewsCodeBlock'
}

export type NewsBlock = NewsImageBlock | NewsTextBlock | NewsCodeBlock

export enum NewsType {
  WARNING = 'warning',
  ALL = 'all'
} 

export interface GetAllNewsParam extends QueryParam {
  title?: string;
  orderBy?: "DESC" | "ASC";
  sort?: 'createdAt' | 'title',
  type?: NewsType
}