import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [RolesService]
})
export class RolesModule {}
