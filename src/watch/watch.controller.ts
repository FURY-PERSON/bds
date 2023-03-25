import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchService } from './watch.service';
import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { Watch } from './watch.entity';
import { CreateWatchDto } from './dto/createWatch.dto';
import { UpdateWatchDto } from './dto/UpdateOptDto.dto';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { WithAuth } from 'src/decorators/with-auth.decorator';

@ApiTags('watch')
@Controller('watch')
export class WatchController {
  constructor(
    private readonly watchService: WatchService
  ) {

  }

  @ClassSerializer(Watch)
  @Post('/')
  @WithAuth()
  @ApiResponse({ type: Watch })
  create(
    @Body() optDto: CreateWatchDto,
    @Req() { user }: RequestWithUser,
    ): Promise<Watch> {
    return this.watchService.createWatch(optDto, user.login)
  }

  @ClassSerializer(Watch)
  @Get('/:id')
  @ApiResponse({ type: Watch })
  getById(@Param('id') name: string): Promise<Watch> {
    return this.watchService.getById(name)
  }

  @ClassSerializer(Watch)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @ApiQuery({
    name: "login",
    type: String,
    required: false,
  })
  @ApiResponse({ type: [Watch] })
  getAllByIds(
    @Query() {ids, login}:  {ids?: string[], login?: string}
    ): Promise<Watch[]> {
      if(!ids && !login) {
        return this.watchService.getAllWatch()
      }

    return this.watchService.getByIds(ids, login)
  }

  @ClassSerializer(Watch)
  @Put('/:id')
  @ApiResponse({ type: Watch })
  updateNews(
    @Body() updateDto: UpdateWatchDto,
    @Param('id') id: string,
  ): Promise<Watch> {
    return this.watchService.updateOptById(id, updateDto)
  }
}
