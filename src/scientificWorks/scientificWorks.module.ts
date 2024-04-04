import { Module } from '@nestjs/common';
import { ScientificWorksService } from './scientificWorks.service';
import { ScientificWorksController } from './scientificWorks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScientificWork } from './entities/scientificWorks.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  providers: [ScientificWorksService, MessageProviderService],
  controllers: [ScientificWorksController],
  imports: [
    TypeOrmModule.forFeature([ScientificWork]),
    UsersModule
  ]
})
export class ScientificWorksModule {}
