import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializer } from 'src/serializers/class.serializer';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/users.entity';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {

  }

  @ClassSerializer(User)
  @Post('/register')
  @ApiResponse({ type: User })
  @ApiBody({
    type: CreateUserDto,
  })
  create(@Body() userDto: CreateUserDto): Promise<{token: string}> {
    return this.authService.register(userDto)
  }

  @ClassSerializer(User)
  @Post('/login')
  @ApiResponse({ type: User })
  @ApiBody({
    type: LoginDto,
  })
  login(@Body() loginDto: LoginDto): Promise<AuthTokenDto> {
    return this.authService.login(loginDto)
  }

}
