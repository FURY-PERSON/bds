import { Body, Controller, Delete, Get, Param, Post, Put, Query, Response } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/createBlock.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';
import { Block } from './entities/block.entity';
import { Response as Res } from 'express';
import { BlockSanitaryVisit } from './entities/blockSanitaryVisit.entity';
import { CreateBlockSanitaryVisitDto } from './dto/createBlockSanitaryVisit.dto';
import { UpdateBlockSanitaryVisitDto } from './dto/updateBlockSanitaryVisit.dto';
import { BlockSanitaryMark } from './entities/blockSanitaryMark.entity';
import { UpdateBlockSanitaryMarkDto } from './dto/updateBlockSanitaryMark.dto';
import { AddUserToBlockDto } from './dto/addUserToBlock.dto';
import { DeleteUserFromBlock } from './dto/deleteUserFromBlock.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { WithRole } from 'src/decorators/withRoles.decorator';

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
  @Roles("admin")
  @WithRole()
  createBlock(
    @Body() blockDto: CreateBlockDto,
  ): Promise<Block> {
    return this.blockService.createBlock(blockDto)
  }

  @ClassSerializer(Block)
  @Put('/:id')
  @WithAuth()
  @ApiResponse({ type: Block })
  @Roles("admin", 'worker')
  @WithRole()
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
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  @ApiResponse({ type: Block })
  getBlockById(@Param('id') id: string): Promise<Block> {
    return this.blockService.getById(id)
  }

  @ClassSerializer(Block)
  @Get('dorm/:dormId')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: [Block] })
  getBlocksByDormId(@Param('dormId') dormId: string): Promise<Block[]> {
    return this.blockService.getByDormId(dormId)
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
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "number",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "floor",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "orderBy",
    type: String,
    required: false,
  })
  @Roles("admin", 'worker', 'user', 'student')
  @WithRole()
  @ApiResponse({ type: [Block] })
  async getAllBlocksByIds( 
    @Query('ids') ids?: string[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy: 'DESC' | 'ASC' = 'DESC',
    @Query('floor') floor?: number,
    @Query('number') number?: string,
    @Response() res?: Res
    ) {

    if(ids) {
      const blocksIds = Array.isArray(ids) ? ids : [ids];
      const blocks = await this.blockService.getByIds(blocksIds);
      res.send(blocks)
      return blocks
    }

    const {result, total, totalPage} = await this.blockService.getAllBlocks({page, limit, orderBy, floor, number})
    res.set({'X-Total-Item': total })
    res.set({'X-Current-Page': page })
    res.set({'X-Total-Page': totalPage})
    res.send(result)
    return result
  }



  @ClassSerializer(BlockSanitaryVisit)
  @Post('/sanitaryVisit')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: BlockSanitaryVisit })
  createBlockSanitaryVisit(
    @Body() blockSanitaryVisitDto: CreateBlockSanitaryVisitDto,
  ): Promise<BlockSanitaryVisit> {
    return this.blockService.createBlockSanitaryVisit(blockSanitaryVisitDto)
  }

  @ClassSerializer(BlockSanitaryVisit)
  @Put('/sanitaryVisit/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: BlockSanitaryVisit })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateBlockSanitaryVisit(
    @Body() blockSanitaryVisitDto: UpdateBlockSanitaryVisitDto,
    @Param() id: string,
  ): Promise<BlockSanitaryVisit> {
    return this.blockService.updateBlockSanitaryVisit(blockSanitaryVisitDto, id)
  }

  @ClassSerializer(BlockSanitaryMark)
  @Put('/sanitaryMark/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: BlockSanitaryMark })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  updateBlockSanitaryMark(
    @Body() blockSanitaryVisitDto: UpdateBlockSanitaryMarkDto,
    @Param() id: string,
  ): Promise<BlockSanitaryMark> {
    return this.blockService.updateBlockSanitaryMark(blockSanitaryVisitDto, id)
  }

  @ClassSerializer(BlockSanitaryVisit)
  @Get('/sanitaryVisit/:id')
  @WithAuth()
  @Roles("admin", 'worker', 'student', 'user')
  @WithRole()
  @ApiResponse({ type: BlockSanitaryVisit })
  getBlockSanitaryVisits(@Param('id') blockId: string): Promise<BlockSanitaryVisit[]> {
    return this.blockService.getBlockSanitaryVisits(blockId)
  }

  @Delete('sanitaryVisit/:id')
  @WithAuth()
  @ApiParam({
    name: 'id',
  })
  @Roles("admin")
  @WithRole()
  @ApiResponse({ type: BlockSanitaryVisit })
  deleteBlock(
    @Param() id: string,
  ): Promise<void> {
    return this.blockService.deleteSanitaryVisitById(id)
  }


  @ClassSerializer(Block)
  @Put('/user/:id')
  @WithAuth()
  @Roles("admin", 'worker')
  @WithRole()
  @ApiResponse({ type: Block })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  addUserToBlock(
    @Body() blockSanitaryVisitDto: AddUserToBlockDto,
    @Param() id: string,
  ): Promise<Block> {
    return this.blockService.addUserToBlock(blockSanitaryVisitDto, id)
  }

  @ClassSerializer(Block)
  @Delete('/user/:id')
  @WithAuth()
  @ApiResponse({ type: Block })
  @ApiParam({
    name: "id",
    type: String,
    required: false,
  })
  @Roles("admin", 'worker')
  @WithRole()
  deleteUserFromBlock(
    @Body() blockSanitaryVisitDto: DeleteUserFromBlock,
    @Param() id: string,
  ): Promise<Block> {
    return this.blockService.deleteUserFromBlock(blockSanitaryVisitDto, id)
  }

}
