import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/createBlock.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';
import { Block } from './entities/block.entity';

@Controller('block')
@ApiTags('Block')
export class BlockController {
  constructor(
    private readonly blockService: BlockService
  ) {

  }

  @ClassSerializer(Block)
  @Post('/')
  @WithAuth()
  @ApiResponse({ type: Block })
  createBlock(
    @Body() newsDto: CreateBlockDto,
  ): Promise<Block> {
    return this.blockService.createBlock(newsDto)
  }

  @ClassSerializer(Block)
  @Put('/:id')
  @WithAuth()
  @ApiResponse({ type: Block })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateBlock(
    @Body() blockDto: UpdateBlockDto,
    @Param() id: string,
  ): Promise<Block> {
    return this.blockService.updateBlock(blockDto, id)
  }


  @ClassSerializer(Block)
  @Get('/:id')
  @WithAuth()
  @ApiResponse({ type: Block })
  getBlockById(@Param('id') name: string): Promise<Block> {
    return this.blockService.getById(name)
  }

  @ClassSerializer(Block)
  @Get('/')
  @WithAuth()
  @ApiQuery({
    name: "ids",
    type: String,
    required: false,
    isArray: true
  })
  @ApiResponse({ type: [Block] })
  getAllBlocksByIds(
    @Query() {ids}:  {ids?: string[]}
    ): Promise<Block[]> {
      if(!ids) {
        return this.blockService.getAll()
      }

    const blockIds = Array.isArray(ids) ? ids : [ids];
    return this.blockService.getByIds(blockIds)
  }

}
