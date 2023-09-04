import { Body, Controller, Delete, Param, Post, Put, Req } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureFlag } from './entities/featureFlag.entity';
import { FeatureFlagService } from './feature-flag.service';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateFeatureFlagDto } from './dto/createFeatureFlag.dto';
import { UpdateFeatureFlagDto } from './dto/updateFeatureFlag.dto';

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
}
