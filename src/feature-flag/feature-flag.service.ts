import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/featureFlag.entity';
import { In, Repository } from 'typeorm';
import { UpdateFeatureFlagDto } from './dto/updateFeatureFlag.dto';
import { CreateFeatureFlagDto } from './dto/createFeatureFlag.dto';
import { FeatureFlagList } from './entities/featureFlagList.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureFlagRepository: Repository<FeatureFlag>,
    @InjectRepository(FeatureFlagList)
    private featureFlagListRepository: Repository<FeatureFlagList>,
    ) {

  }

  async addFeatureFlagsToUser(user: User) {
    const features = await this.featureFlagListRepository.find();

    this.featureFlagRepository.save({
      user: user,
      features: features.map((feature) => ({
        name: feature.name,
        active: false
      }))
    })
  }

  async createFeatureFlag(featureFlagDto: CreateFeatureFlagDto) {
    const featureFlags = await this.featureFlagRepository.find();

    featureFlags.forEach((featureFlag) => {
      featureFlag.features = [...featureFlag.features, {name: featureFlagDto.name, active: featureFlagDto.active}]
      this.featureFlagRepository.save(featureFlag)
    })

    this.featureFlagListRepository.save({
      name: featureFlagDto.name
    })
  }

  async updateFeatureFlag(featureFlagDto: UpdateFeatureFlagDto, featureFlagName: string) {
    const featureFlags = await this.featureFlagRepository.find({
      where: {
        user: {
          login: featureFlagDto.usersLogin ? In(featureFlagDto.usersLogin) : undefined
        }
      }
    });

    featureFlags.forEach((featureFlag) => {
      featureFlag.features = featureFlag.features.map((feature) => {
        if(feature.name === featureFlagName) {
          return {
            ...feature,
            active: featureFlagDto.active ?? feature.active
          }
        }

        return feature
      })

      this.featureFlagRepository.save(featureFlag)
    })
  }

  async deleteByName(featureFlagName: string) {
    const featureFlags = await this.featureFlagRepository.find();

    featureFlags.forEach((featureFlag) => {
      featureFlag.features = featureFlag.features.filter((feature) => feature.name !== featureFlagName)
      this.featureFlagRepository.save(featureFlag)
    })

    this.featureFlagListRepository.delete({
      name: featureFlagName
    })
  }
}
