import { ChildEntity, Column} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NewsBlockType } from '../types/types';
import { NewsBlockBase } from './newsBlockBase.entity';

@ChildEntity()
export class NewsImageBlock  extends NewsBlockBase {

  @ApiProperty()
  @Column()
  src: string;

  @ApiProperty()
  @Column()
  title?: string

}