import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DormsModule } from 'src/dorms/dorms.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
  imports: [
    TypeOrmModule.forFeature([Block]),
    DormsModule,
  ]
})
export class BlockModule {}
