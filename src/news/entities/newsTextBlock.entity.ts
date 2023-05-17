import { ChildEntity, Column} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NewsBlockType } from '../types/types';
import { NewsBlockBase } from './newsBlockBase.entity';

@ChildEntity()
export class NewsTextBlock extends NewsBlockBase {

  @ApiProperty({isArray: true})
  @Column("text", {array: true})
  paragraphs: string[];

  @ApiProperty()
  @Column({nullable: true})
  title?: string
}