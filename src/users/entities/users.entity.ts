import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/roles.entity';
import { Permission } from 'src/permissions/permisions.entity';

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Exclude()
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
}