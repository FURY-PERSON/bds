import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DormsModule } from 'src/dorms/dorms.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';
import { BlockSanitaryVisit } from './entities/blockSanitaryVisit.entity';
import { BlockSanitaryMark } from './entities/blockSanitaryMark.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
  imports: [
    TypeOrmModule.forFeature([Block, BlockSanitaryVisit, BlockSanitaryMark]),
    DormsModule,
    UsersModule
  ]
})
export class BlockModule {}
