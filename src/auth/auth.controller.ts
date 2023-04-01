import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WithAuth } from 'src/decorators/with-auth.decorator';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { RequestWithUser } from 'src/types/request-with-user.interface';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/users.entity';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/resresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {

  }

  @ClassSerializer(User)
  @Post('/register')
  @ApiResponse({ type: AuthResponseDto })
  @ApiBody({
    type: CreateUserDto,
  })
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto)
  }

  @ClassSerializer(User)
  @Post('/login')
  @ApiResponse({ type: AuthResponseDto })
  @ApiBody({
    type: AuthDto,
  })
  login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto)
  }

  @ClassSerializer(User)
  @Post('/refresh')
  @WithAuth()
  @ApiResponse({ type: AuthResponseDto })
  refresh(
    @Req() { user }: RequestWithUser,
    @Body() resfreshDto: RefreshDto
  ) {
    return this.authService.refresh(user.login, resfreshDto)
  }

}
