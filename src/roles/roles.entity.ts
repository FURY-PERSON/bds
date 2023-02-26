import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

@Entity({ name: "role" })
export class Role {
  @ApiProperty()
  @PrimaryColumn()
  name: string;
 
  @ApiProperty()
  @Column()
  description: string;
}