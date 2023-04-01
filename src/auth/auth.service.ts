import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/resresh.dto';
import { Roles } from 'src/roles/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(createUserDto: CreateUserDto) {

    const userExists = await this.usersService.getByLogin(
      createUserDto.login, false
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);

    const roleName = createUserDto.roleName || Roles.STUDENT

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
      roleName: roleName
    });
    
    const tokens = await this.getTokens(newUser.id, newUser.login);
    newUser.refreshToken = tokens.refreshToken;

    return {
      user: newUser,
      tokens
    };
  }

	async login(data: AuthDto) {
    const user = await this.usersService.getByLogin(data.login);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.login);
    user.refreshToken = tokens.refreshToken;
    
    const updatedUser = await this.usersService.updateByLogin(user.login, user)
    return {
      user: updatedUser,
      tokens
    };
  }

  async refresh(refreshDto: RefreshDto) {
    const login = (this.jwtService.decode(refreshDto.accessToken) as any)!.login

    const user = await this.usersService.getByLogin(login, true);
    if (!user) throw new BadRequestException('User does not exist');

    if(user.refreshToken !== refreshDto.refreshToken) throw new ForbiddenException('Access denided');

    const tokens = await this.getTokens(user.id, user.login);

    const updatedUser =  await this.usersService.updateByLogin(login, {
      refreshToken: tokens.refreshToken,
    });

    return {
      user: updatedUser,
      tokens
    };
  }

	async logout(login: string) {
    return this.usersService.updateByLogin(login, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          login,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}