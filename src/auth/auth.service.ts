import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcryptjs"
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    ) {

  }

  async register(userDto: CreateUserDto) {
    const {login, password} = userDto;

    const user = await this.userService.getByLogin(login)

    if(user) {
      throw new HttpException('User already registered', HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const createdUser = await this.userService.createUser({...userDto, password: hashedPassword});

    return this.generateToken(createdUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const token = this.generateToken(user);
    return {
      token: token.token,
      user
    };
  }

  private generateToken(user: User) {
    const payload = {
      roles: user.roles,
      id: user.id,
      login: user.login
    }

    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(loginDto: LoginDto) {
    const {login} = loginDto;
    const userFromBd = await this.userService.getByLogin(login);
    if(!userFromBd) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const passwordEquals = await bcrypt.compare(loginDto.password, userFromBd.password);

    if(!passwordEquals) {
      throw new UnauthorizedException('Incorrect login or password')
    }

    return userFromBd;
  }
}
