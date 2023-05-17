import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/permissions/permisions.entity';
import { Roles } from './types';
import { User } from 'src/users/entities/users.entity';

@Entity({ name: "role" })
export class Role {
  @ApiProperty()
  @PrimaryColumn()
  name: Roles;
 
  @ApiProperty()
  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}