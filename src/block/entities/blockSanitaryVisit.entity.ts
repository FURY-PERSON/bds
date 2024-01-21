import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Block } from './block.entity';
import { BlockSanitaryMark } from './blockSanitaryMark.entity';

@Entity({ name: "blockSanitaryVisit" })
export class BlockSanitaryVisit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  date: Date;

  @ManyToOne(() => Block, block => block.sanitaryVisits)
  block: Block

  @OneToMany(() => BlockSanitaryMark, marks => marks.visit, {onDelete: 'CASCADE'})
  @JoinColumn()
  marks: BlockSanitaryMark[]
}