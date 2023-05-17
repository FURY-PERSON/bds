import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, Length, ValidateIf, IsEnum } from "class-validator";
import { Roles } from "src/roles/types";

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @ValidateIf(o => o.firstName)
  firstName?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(o => o.lastName)
  lastName?: string;

  @ApiProperty()
  @IsPhoneNumber()
  @ValidateIf(o => o.phone)
  phone?: string

  @ApiProperty()
  @ValidateIf(o => o.email)
  @IsEmail()
  email?: string

  @ApiProperty()
  @ValidateIf(o => o.email)
  refreshToken?: string

  @ApiProperty()
  @ValidateIf(o => o.role)
  @IsEnum(Roles)
  roleName?: Roles;

  @ApiProperty()
  @ValidateIf(o => o.permissionsIds)
  permissionsIds?: string[];
}
