import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Dorm } from 'src/dorms/dorms.entity';
import { IsNotEmpty } from 'class-validator';
import { Room } from 'src/room/room.entity';

@Entity({ name: "block" })
export class Block {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  number: string;

  @ManyToOne(() => Dorm, dorm => dorm.block)
  dorm:Dorm
  
  @OneToMany(() => Room, rooms => rooms.block)
  rooms: Room
}