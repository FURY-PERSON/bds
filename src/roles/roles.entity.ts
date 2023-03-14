import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/permissions/permisions.entity';

@Entity({ name: "role" })
export class Role {
  @ApiProperty()
  @PrimaryColumn()
  name: string;
 
  @ApiProperty()
  @Column()
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}