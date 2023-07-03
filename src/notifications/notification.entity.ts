import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "notification" })
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({nullable: true})
  @Column({nullable: true})
  title: string;

  @ApiProperty({nullable: true})
  @Column({nullable: true})
  subTitle: string;

  @ApiProperty()
  @Column()
  mainText: string;

  @ApiProperty()
  @Column()
  link: string;

  @ApiProperty()
  readed?: boolean;

  @ManyToOne(() => User, user => user.createdNotifications)
  author: User

  @ManyToMany(() => User, user => user.notifications)
  @JoinTable()
  @Exclude()
  users: User[]

  @ManyToMany(() => User, user => user.readedNotifications)
  @JoinTable()
  @Exclude()
  readedUsers: User[]

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}