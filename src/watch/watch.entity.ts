import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { Shift, WatchStatus } from './types/enums';

@Entity({ name: "watch" })
export class Watch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({
    nullable: true
  })
  title?: string;

  @ApiProperty()
  @Column({
    nullable: true
  })
  subTitle?: string;

  @ApiProperty()
  @Column()
  date: Date

  @ApiProperty()
  @Column()
  shift: Shift

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  executor?: User;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({
    nullable: true,
    enum: WatchStatus
  })
  @ApiProperty()
  status: WatchStatus
}