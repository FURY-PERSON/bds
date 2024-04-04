import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';
import { ScientificWorksService } from './scientificWorks.service';
import { ScientificWork } from './entities/scientificWorks.entity';
import { CreateScientificWorksDto } from './dto/createScientificWorks.dto';
import { UpdateScientificWorksDto } from './dto/updateScientificWorks.dto';

@Controller('scientific-works')
@ApiTags('ScientificWork')
export class ScientificWorksController {
  constructor(
    private readonly scientificWorksService: ScientificWorksService
  ) {

  }

  @ClassSerializer(ScientificWork)
  @Post('/')
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: ScientificWork })
  createScientificWork(
    @Body() scientificWorkDto: CreateScientificWorksDto,
  ): Promise<ScientificWork> {
    return this.scientificWorksService.createScientificWork(scientificWorkDto)
  }

  @ClassSerializer(ScientificWork)
  @Put('/:id')
  @WithAuth()
  @ApiResponse({ type: ScientificWork })
  @Roles("admin", 'worker')
  @WithRole()
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateScientificWork(
    @Body() scientificWorkDto: UpdateScientificWorksDto,
    @Param() id: string,
  ): Promise<ScientificWork> {
    return this.scientificWorksService.updateScientificWork(scientificWorkDto, id)
  }


  @ClassSerializer(ScientificWork)
  @Get('/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: ScientificWork })
  getScientificWorkById(@Param('id') name: string): Promise<ScientificWork> {
    return this.scientificWorksService.getById(name)
  }

  @ClassSerializer(ScientificWork)
  @Get('user/:login')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: [ScientificWork] })
  getScientificWorksByUser(@Param('login') login: string): Promise<ScientificWork[]> {
    return this.scientificWorksService.getUsersScientificWorks(login)
  }


  @ClassSerializer(ScientificWork)
  @Delete('/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: ScientificWork })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  deleteUserFromBlock(
    @Param() id: string,
  ): Promise<void> {
    return this.scientificWorksService.deleteByID(id)
  }
}
