import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: Dorm })
  create(
    @Body() dormDto: CreateDormDto,
    @UploadedFile() image?: Express.Multer.File
    ): Promise<CreateDormDto> {
    return this.dormService.createDorm(dormDto, image)
  }

  @ClassSerializer(Dorm)
  @Get('/:name')
  @ApiResponse({ type: Dorm })
  getByName(@Param('name') name: string): Promise<Dorm> {
    return this.dormService.getByName(name)
  }

  @ClassSerializer(Dorm)
  @Get('/')
  @ApiQuery({
    name: "names",
    type: String,
    required: false,
    isArray: true
  })
  @ApiResponse({ type: [Dorm] })
  getAllByNames(
    @Query('names') names?: string[]
    ): Promise<Dorm[]> {
      if(!names) {
        return this.dormService.getAllDorms()
      }

    const dormNames = Array.isArray(names) ? names : [names];
    return this.dormService.getAllDormsByName(dormNames)
  }

  @ClassSerializer(Dorm)
  @Put('/:id')
  @ApiResponse({ type: Dorm })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  updateNews(
    @Body() newsDto: UpdateDormDto,
    @Param('id') id: string,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<Dorm> {
    return this.dormService.updateDormByName(id, newsDto, image)
  }
}
