import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RebukeService } from './rebuke.service';
import { Rebuke } from './entities/rebuke.entity';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { CreateRebukeDto } from './dto/createRebuke.dto';
import { UpdateRebuke } from './dto/updateRebuke.dto';

@Controller('rebuke')
@ApiTags('rebuke')
export class RebukeController {
  constructor(
    private readonly rebukeService: RebukeService
  ) {

  }

  @ClassSerializer(Rebuke)
  @Post('/')
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Rebuke })
  createRebuke(
    @Body() rebukeDto: CreateRebukeDto,
  ): Promise<Rebuke> {
    return this.rebukeService.cerateRebuke(rebukeDto)
  }

  @ClassSerializer(Rebuke)
  @Put('/:id')
  @WithAuth()
  @ApiResponse({ type: Rebuke })
  @Roles("admin", 'worker')
  @WithRole()
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateRebuke(
    @Body() scientificWorkDto: UpdateRebuke,
    @Param() id: string,
  ): Promise<Rebuke> {
    return this.rebukeService.updateRebuke(scientificWorkDto, id)
  }


  @ClassSerializer(Rebuke)
  @Get('/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Rebuke })
  getRebukeById(@Param('id') id: string): Promise<Rebuke> {
    return this.rebukeService.getById(id)
  }

  @ClassSerializer(Rebuke)
  @Get('user/:login')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: [Rebuke] })
  getRebukesByUser(@Param('login') login: string): Promise<Rebuke[]> {
    return this.rebukeService.getUserRebukes(login)
  }


  @ClassSerializer(Rebuke)
  @Delete('/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Rebuke })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  deleteRebuke(
    @Param() id: string,
  ): Promise<void> {
    return this.rebukeService.deleteByID(id)
  }
}
