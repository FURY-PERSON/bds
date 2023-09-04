import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.entity';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { News } from './news/entities/news.entity';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PermissionsModule } from './permissions/permissions.module';
import * as path from 'path';
import { Permission } from './permissions/permisions.entity';
import { DormsModule } from './dorms/dorms.module';
import { OptModule } from './opt/opt.module';
import { WatchModule } from './watch/watch.module';
import { BlockModule } from './block/block.module';
import { RoomModule } from './room/room.module';
import { NewsCodeBlock } from './news/entities/newsCodeBlock.entity';
import { NewsTextBlock } from './news/entities/newsTextBlock.entity';
import { NewsImageBlock } from './news/entities/newsImageBlock.entity';
import { NewsBlockBase } from './news/entities/newsBlockBase.entity';
import { CommentModule } from './comment/comment.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FeatureFlagModule } from './feature-flag/feature-flag.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname,  '..', 'static'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Role, News, Permission, NewsCodeBlock, NewsTextBlock, NewsImageBlock, NewsBlockBase],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    NewsModule,
    FilesModule,
    PermissionsModule,
    DormsModule,
    OptModule,
    WatchModule,
    BlockModule,
    RoomModule,
    CommentModule,
    NotificationsModule,
    FeedbackModule,
    FeatureFlagModule,
  ],
})
export class AppModule {
  constructor() {
  }
}
