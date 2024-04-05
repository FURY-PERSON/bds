import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ScientificWorkType } from '../types/scientificWorks';
import { User } from 'src/users/entities/users.entity';

@Entity({ name: "scientificWorks" })
export class ScientificWork {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  title: string;

  @ApiProperty({example: 'publication'})
  @Column()
  @IsNotEmpty()
  type: ScientificWorkType

  @ApiProperty()
  @Column()
  date: Date

  @ManyToOne(() => User, user => user.scientificWorks)
  user:User
}