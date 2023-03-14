import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}
