import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateOptDto } from './dto/createOpt.dto';
import { UpdateOptDto } from './dto/updateOpt.dto';
import { Opt } from './opt.entity';
import { OptService } from './opt.service';


@ApiTags('Opt')
@Controller('opt')
export class OptController {
  constructor(
    private readonly optService: OptService
  ) {

  }

  @ClassSerializer(Opt)
  @Post('/')
  @ApiResponse({ type: Opt })
  create(@Body() optDto: CreateOptDto): Promise<Opt> {
    return this.optService.createOpt(optDto)
  }

  @ClassSerializer(Opt)
  @Get('/:id')
  @ApiResponse({ type: Opt })
  getById(@Param('id') name: string): Promise<Opt> {
    return this.optService.getById(name)
  }

  @ClassSerializer(Opt)
  @Get('/')
  @ApiQuery({
    name: "ids",
    type: String,
    required: false
  })
  @ApiResponse({ type: [Opt] })
  getAllByIds(
    @Query('ids') ids?: string[]
    ): Promise<Opt[]> {
      if(!ids) {
        return this.optService.getAllOpt()
      }

      const optIds = Array.isArray(ids) ? ids : [ids];
    return this.optService.getByIds(optIds)
  }

  @ClassSerializer(Opt)
  @Put('/:id')
  @ApiResponse({ type: Opt })
  updateNews(
    @Body() updateDto: UpdateOptDto,
    @Param('id') id: string,
  ): Promise<Opt> {
    return this.optService.updateOptById(id, updateDto)
  }
}
