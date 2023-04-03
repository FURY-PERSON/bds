import { NewsCodeBlock } from "../entities/newsCodeBlock.entity";
import { NewsImageBlock } from "../entities/newsImageBlock.entity";
import { NewsTextBlock } from "../entities/newsTextBlock.entity";

export enum NewsBlockType {
  IMAGE = 'image',
  TEXT = 'text',
  CODE = 'code'
}

export type NewsBlock = NewsImageBlock | NewsTextBlock | NewsCodeBlock

export enum NewsType {
  WARNING = 'warning'
}