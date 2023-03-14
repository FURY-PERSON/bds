import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsPhoneNumber()
  @ApiProperty()
  phone: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  login: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(4, 16)
  password: string

  @IsEmail()
  @ApiProperty()
  email?: string
}
