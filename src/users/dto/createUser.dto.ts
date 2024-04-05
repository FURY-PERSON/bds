import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, Length, IsEnum, IsNumber, Min, Max, IsBoolean } from "class-validator";
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

  @IsNumber()
  @ApiProperty()
  @Min(1)
  @Max(10)
  averageMark?: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  login: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  budget: boolean

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  course: number

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
