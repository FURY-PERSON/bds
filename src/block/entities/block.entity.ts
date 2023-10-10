import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  floor: number;

  @ManyToOne(() => Dorm, dorm => dorm.block)
  dorm:Dorm
  
  @OneToMany(() => Room, rooms => rooms.block)
  rooms: Room[]
}