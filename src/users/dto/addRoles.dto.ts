import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ArrayMinSize } from "class-validator";

export class AddRolesDto {
  @IsNotEmpty()
  @ApiProperty()
  roles: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
