import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { OptStatus } from './types/enums';

@Entity({ name: "opt" })
export class Opt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({
    nullable: true
  })
  subTitle: string;

  @ApiProperty()
  @Column()
  hours: number

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    nullable: true
  })
  @ApiProperty()
  maxExecutorAmount?: number

  @ManyToMany(() => User)
  @JoinTable()
  executors: User[];

  @Column({
    nullable: true,
    enum: OptStatus
  })
  @ApiProperty()
  status: OptStatus
}