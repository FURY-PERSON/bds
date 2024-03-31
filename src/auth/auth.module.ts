import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, ConfigService, MessageProviderService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({})
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
