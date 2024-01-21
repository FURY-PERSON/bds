import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BlockSanitaryEntity } from '../types/blockSanitary';
import { BlockSanitaryVisit } from './blockSanitaryVisit.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: "blockSanitaryMark" })
export class BlockSanitaryMark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  @IsEnum(BlockSanitaryEntity)
  type: BlockSanitaryEntity;

  @ApiProperty()
  @Column({nullable: true})
  mark?: number;

  @ManyToOne(() => BlockSanitaryVisit, blockSanitaryVisit => blockSanitaryVisit.marks, {onDelete: 'CASCADE'})
  @Exclude()
  visit: BlockSanitaryVisit
}