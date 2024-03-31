import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FeatureFlagModule } from 'src/feature-flag/feature-flag.module';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MessageProviderService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    RolesModule,
    PermissionsModule,
    FeatureFlagModule,
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
