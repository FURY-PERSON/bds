import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: "dorm" })
export class Dorm {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  phone: string

  @ApiProperty()
  @Column()
  email: string

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;
}