import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/users.entity';


@Entity({ name: "featureFlag" })
export class FeatureFlag {
  @PrimaryGeneratedColumn("uuid")
  @Exclude()
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({type: 'json'})
  features?: Array<{
    name: string,
    active: boolean
  }>;
  
  @OneToOne(() => User, (user) => user.featureFlags)
  @JoinColumn()
  user: User;
}