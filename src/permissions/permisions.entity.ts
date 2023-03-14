import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: "permission" })
export class Permission {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;
 
  @ApiProperty()
  @Column({
    unique: true
  })
  name: string;

  @ApiProperty()
  @Column()
  description: string;
}