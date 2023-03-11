import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';

@Entity({ name: "news" })
export class News {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  subTitle: string;

  @ApiProperty()
  @Column()
  mainText: string;

  @ApiProperty()
  @Column({nullable: true})
  imageName?: string;

  @ApiProperty()
  @Column({nullable: true})
  imageUrl?: string;

  @OneToOne(() => User)
  @JoinColumn()
  author: User

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}