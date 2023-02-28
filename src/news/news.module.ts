import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { NewsController } from './news.controller';
import { News } from './news.entity';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    FilesService
  ],
  imports: [
    TypeOrmModule.forFeature([News]),
  ]
})
export class NewsModule {}
