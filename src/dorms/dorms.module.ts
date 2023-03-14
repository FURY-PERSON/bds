import { Module } from '@nestjs/common';
import { DormsService } from './dorms.service';
import { DormsController } from './dorms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dorm } from './dorms.entity';

@Module({
  providers: [DormsService],
  controllers: [DormsController],
  imports: [
    TypeOrmModule.forFeature([Dorm])
  ],
  exports: [
    DormsService
  ]
})
export class DormsModule {}
