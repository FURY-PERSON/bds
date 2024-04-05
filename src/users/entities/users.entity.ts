import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/roles.entity';
import { Permission } from 'src/permissions/permisions.entity';
import { News } from 'src/news/entities/news.entity';
import { Comment } from 'src/comment/comment.entity';
import { Notification } from 'src/notifications/notification.entity';
import { Feedback } from 'src/feedback/feedback.entity';
import { FeatureFlag } from 'src/feature-flag/entities/featureFlag.entity';
import { Room } from 'src/room/room.entity';
import { Block } from 'src/block/entities/block.entity';
import { ScientificWork } from 'src/scientificWorks/entities/scientificWorks.entity';
import { Rebuke } from 'src/rebuke/entities/rebuke.entity';

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
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
  @Column({
    nullable: true
  })
  averageMark?: number

  @ApiProperty()
  @Column()
  login: string

  @Column()
  @Exclude()
  password: string

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @ApiProperty()
  @Column({
    nullable: true
  })
  email?: string

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToMany(() => Permission)
  @JoinTable()
/*   @Transform(({ value }) => value.map(({ name }) => name)) */
  permissions: Permission[];

  @Column({nullable: true})
  @Exclude()
  refreshToken?: string

  @OneToMany(() => News, news => news.author)
  news: News

  @OneToMany(() => Comment, comment => comment.author)
  comments?: Comment[]

  @OneToMany(() => Comment, comment => comment.likers)
  likers: Comment

  @OneToMany(() => Comment, comment => comment.dislikers)
  dislikers: Comment

  @OneToMany(() => Feedback, feedback => feedback.author)
  feedbacks: Feedback

  @OneToMany(() => Notification, comment => comment.author)
  createdNotifications: Notification[]

  @OneToMany(() => ScientificWork, scientificWork => scientificWork.user)
  scientificWorks: ScientificWork[]

  @OneToMany(() => Rebuke, rebuke => rebuke.user)
  rebukes: Rebuke[]

  @ManyToOne(() => Room, room => room.tenants)
  room: Room

  @ManyToOne(() => Block, block => block.tenants)
  block: Block

  @ManyToMany(() => Notification, notification => notification.users)
  notifications: Notification[]

  @ManyToMany(() => Notification, comment => comment.readedUsers)
  readedNotifications: Notification[]

  @OneToOne(() => FeatureFlag, (featureFlag) => featureFlag.user, { eager: true })
  featureFlags: FeatureFlag;
}