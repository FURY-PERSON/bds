import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

export class AuthTokenDto {
    @ApiProperty()
    token: string;
    @Type(() => User)
    @ApiProperty({ type: User })
    user: User;
}
