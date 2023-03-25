import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Dorm } from 'src/dorms/dorms.entity';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: "block" })
export class Block {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Dorm)
  @JoinColumn()
  dorm:Dorm

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  number: string;
}