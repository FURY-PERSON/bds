import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Exclude()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true
  })
  phone: string

  @Column()
  login: string

  @Column()
  password: string

  @Column({
    nullable: true
  })
  email?: string
}