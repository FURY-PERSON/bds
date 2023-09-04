import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "featureFlagList" })
export class FeatureFlagList {
  @PrimaryColumn()
  name: string;
}