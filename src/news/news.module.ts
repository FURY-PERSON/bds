import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DormsModule } from 'src/dorms/dorms.module';
import { FilesService } from 'src/files/files.service';
import { UsersModule } from 'src/users/users.module';
import { NewsController } from './news.controller';
import { News } from './news.entity';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    FilesService,
  ],
  imports: [
    TypeOrmModule.forFeature([News]),
    DormsModule,
    UsersModule
  ]
})
export class NewsModule {}
