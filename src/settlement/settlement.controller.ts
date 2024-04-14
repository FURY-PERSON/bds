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
  async create(@Body() settlementsDto: {settlement: ApplySettlementDto[]}): Promise<void> {
    const settlementPromises = settlementsDto.settlement.map((settlement) => this.settlementService.applySettlement(settlement))
    Promise.all(settlementPromises)
  }
}
