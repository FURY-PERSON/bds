import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Block } from 'src/block/entities/block.entity';
import { User } from 'src/users/entities/users.entity';

@Entity({ name: "room" })
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  subNumber: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  peopleAmount: number;

  @ManyToOne(() => Block, block => block.rooms)
  block:Block

  @OneToMany(() => User, user => user.room)
  tenants:User[]
}