import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, Length } from "class-validator";

export class UpdateUserDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  phone?: string

  @ApiProperty()
  email?: string

  @ApiProperty()
  refreshToken?: string
}
