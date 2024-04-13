import { Body, Controller, Post } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ApplySettlementDto } from './dto/applySettlement.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('settlement')
@ApiTags('Settlement')
export class SettlementController {
  constructor(
    private readonly settlementService: SettlementService
  ) {

  }


  @Post('/apply-settlement')
  @WithAuth()
  async create(@Body() settlementDto: ApplySettlementDto): Promise<void> {
    this.settlementService.applySettlement(settlementDto)
  }
}
