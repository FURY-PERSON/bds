import { Body, Controller, Post } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ApplySettlementDto } from './dto/applySettlement.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('dorm-settlement')
@ApiTags('Settlement')
export class SettlementController {
  constructor(
    private readonly settlementService: SettlementService
  ) {

  }

  @Post('/apply-settlement')
  @WithAuth()
  async create(@Body() settlementsDto: ApplySettlementDto[]): Promise<void> {
    const settlementPromises = settlementsDto.map((settlement) => this.settlementService.applySettlement(settlement))
    await Promise.all(settlementPromises)
  }
}
