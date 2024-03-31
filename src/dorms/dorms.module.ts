import { Module } from '@nestjs/common';
import { DormsService } from './dorms.service';
import { DormsController } from './dorms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dorm } from './dorms.entity';
import { FilesService } from 'src/files/files.service';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  providers: [DormsService, FilesService, MessageProviderService],
  controllers: [DormsController],
  imports: [
    TypeOrmModule.forFeature([Dorm])
  ],
  exports: [
    DormsService
  ]
})
export class DormsModule {}
