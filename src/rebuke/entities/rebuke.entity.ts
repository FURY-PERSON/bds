import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/users.entity';
import { RebukeType } from '../type/rebuke';

@Entity({ name: "rebuke" })
export class Rebuke {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  type: RebukeType

  @ApiProperty()
  @Column({nullable: true})
  note?: string

  @ApiProperty()
  @Column()
  startDate: Date;

  @ApiProperty()
  @Column()
  endDate: Date;

  @ManyToOne(() => User, user => user.rebukes)
  user:User
}