import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/featureFlag.entity';
import { FeatureFlagList } from './entities/featureFlagList.entity';

@Module({
  providers: [FeatureFlagService],
  controllers: [FeatureFlagController],
  imports: [
    TypeOrmModule.forFeature([FeatureFlag, FeatureFlagList]),
  ],
  exports: [
    FeatureFlagService
  ]
})
export class FeatureFlagModule {}
