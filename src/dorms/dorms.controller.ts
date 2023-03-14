import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { Dorm } from './dorms.entity';
import { DormsService } from './dorms.service';
import { CreateDormDto } from './dto/createDorm.dto';
import { UpdateDormDto } from './dto/updateDorm.dto';

@Controller('dorm')
@ApiTags('Dorm')
export class DormsController {
  constructor(
    private readonly dormService: DormsService
  ) {

  }

  @ClassSerializer(Dorm)
  @Post('/')
  @ApiResponse({ type: Dorm })
  create(@Body() dormDto: CreateDormDto): Promise<CreateDormDto> {
    return this.dormService.createDorm(dormDto)
  }

  @ClassSerializer(Dorm)
  @Get('/')
  @ApiResponse({ type: [Dorm] })
  getAll() {
    return this.dormService.getAllDorms()
  }

  @ClassSerializer(Dorm)
  @Get('/:name')
  @ApiResponse({ type: Dorm })
  getByName(@Param('name') name: string): Promise<Dorm> {
    return this.dormService.getByName(name)
  }

  @ClassSerializer(Dorm)
  @Get('/:names')
  @ApiResponse({ type: [Dorm] })
  getAllByNames(
    @Query('names') names: string[]
    ): Promise<Dorm[]> {
      const dormNames = Array.isArray(names) ? names : [names];
    return this.dormService.getAllDormsByName(dormNames)
  }

  @ClassSerializer(Dorm)
  @Put('/:id')
  @ApiResponse({ type: Dorm })
  updateNews(
    @Body() newsDto: UpdateDormDto,
    @Param() id: string,
  ): Promise<Dorm> {
    return this.dormService.updateDormByName(id, newsDto)
  }
}
