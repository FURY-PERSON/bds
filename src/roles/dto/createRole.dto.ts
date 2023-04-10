import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Roles } from "../types";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: Roles;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
