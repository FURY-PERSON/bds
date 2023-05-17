import { Module } from '@nestjs/common';
import { OptService } from './opt.service';
import { OptController } from './opt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opt } from './opt.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [OptService],
  controllers: [OptController],
  imports: [
    TypeOrmModule.forFeature([Opt]),
    UsersModule
  ]
})
export class OptModule {}
