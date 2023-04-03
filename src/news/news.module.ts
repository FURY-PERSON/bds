import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DormsModule } from 'src/dorms/dorms.module';
import { FilesService } from 'src/files/files.service';
import { UsersModule } from 'src/users/users.module';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { NewsCodeBlock } from './entities/newsCodeBlock.entity';
import { NewsTextBlock } from './entities/newsTextBlock.entity';
import { NewsImageBlock } from './entities/newsImageBlock.entity';
import { NewsBlockBase } from './entities/newsBlockBase.entity';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    FilesService,
  ],
  imports: [
    TypeOrmModule.forFeature([News, NewsCodeBlock, NewsTextBlock, NewsImageBlock, NewsBlockBase]),
    DormsModule,
    UsersModule
  ]
})
export class NewsModule {}
