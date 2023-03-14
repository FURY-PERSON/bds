import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';

export class AuthResponseDto {
    @ApiProperty()
    tokens: {
      access: string,
      refresh: string
    };

    @Type(() => User)
    @ApiProperty({ type: User })
    user: User;
}