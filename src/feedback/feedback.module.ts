import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [FeedbackService],
  controllers: [FeedbackController],
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    UsersModule,
  ],
  exports: [
    FeedbackService,
  ]
})
export class FeedbackModule {}
