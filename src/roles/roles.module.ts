import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [RolesService]
})
export class RolesModule {}
