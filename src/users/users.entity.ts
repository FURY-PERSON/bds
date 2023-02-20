import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Exclude()
  id: string;

  @ApiProperty({description: 'aaaa'})
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({
    nullable: true
  })
  phone: string

  @ApiProperty()
  @Column()
  login: string

  @Column()
  @Exclude()
  password: string

  @ApiProperty()
  @Column({
    nullable: true
  })
  email?: string
}