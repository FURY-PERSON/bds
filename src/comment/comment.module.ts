import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { NewsModule } from 'src/news/news.module';
import { Comment } from './comment.entity';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [
    TypeOrmModule.forFeature([Comment]),
    RolesModule,
    PermissionsModule,
    UsersModule,
    NewsModule
  ],
  exports: [
    CommentService,
  ]
})
export class CommentModule {}
