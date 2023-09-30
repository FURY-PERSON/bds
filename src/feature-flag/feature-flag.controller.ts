import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from './entities/featureFlag.entity';
import { FeatureFlagService } from './feature-flag.service';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateFeatureFlagDto } from './dto/createFeatureFlag.dto';
import { UpdateFeatureFlagDto } from './dto/updateFeatureFlag.dto';
import { FeatureFlagList } from './entities/featureFlagList.entity';

@ApiTags('feature-flag')
@Controller('feature-flag')
export class FeatureFlagController {
  constructor(
    private readonly featureFlagService: FeatureFlagService
  ) {

  }

  @Delete('/:name')
  @WithAuth()
  @ApiParam({
    name: 'name',
  })
  @ApiResponse({ type: FeatureFlag })
  deleteFeatureFlag(
    @Param() name: string,
  ): Promise<void> {
    return this.featureFlagService.deleteByName(name)
  }

  @ClassSerializer(FeatureFlag)
  @Post('/')
  @ApiResponse({ type: FeatureFlag })
  @WithAuth()
  createFeatureFlag(
    @Body() feedbackDto: CreateFeatureFlagDto,
    @Req() { user }: RequestWithUser,
  ): Promise<void> {
    return this.featureFlagService.createFeatureFlag(feedbackDto)
  }

  @ClassSerializer(FeatureFlag)
  @Put('/:name')
  @WithAuth()
  @ApiParam({
    name: 'name',
  })
  @ApiResponse({ type: FeatureFlag })
  updateComment(
    @Body() feedbackDto: UpdateFeatureFlagDto,
    @Param() name: string,
  ): Promise<void> {
    return this.featureFlagService.updateFeatureFlag(feedbackDto, name)
  }

  @ClassSerializer(FeatureFlag)
  @Get('/')
  @ApiQuery({
    name: "login",
    type: String,
    required: true,
    isArray: true
  })
  @WithAuth()
  @ApiResponse({ type: FeatureFlag })
  getUserFeatureFlags(
    @Query('login') userLogin?: string
    ): Promise<FeatureFlag> {

    return this.featureFlagService.getUserFeatureFlags(userLogin)
  }

  @ClassSerializer(FeatureFlagList)
  @Get('/all')
  @WithAuth()
  @ApiResponse({ type: [FeatureFlagList] })
  getAvailableFeatureFlags(
    ): Promise<FeatureFlagList[]> {
      return this.featureFlagService.getAvailableFeatureFlags()
  }

}
