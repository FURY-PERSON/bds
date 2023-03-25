import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Block } from 'src/block/entities/block.entity';

@Entity({ name: "room" })
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Block)
  @JoinColumn()
  block:Block

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  subNumber: string;
}