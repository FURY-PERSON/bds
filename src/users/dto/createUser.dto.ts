import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, Length, ValidateIf, IsEnum } from "class-validator";
import { Roles } from "src/roles/types";

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

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Roles)
  roleName: Roles;
}
