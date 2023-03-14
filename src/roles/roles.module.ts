import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    TypeOrmModule.forFeature([Role]),
    PermissionsModule
  ],
  exports: [RolesService]
})
export class RolesModule {}
