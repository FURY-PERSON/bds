import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddPermissionsDto {
  @IsNotEmpty()
  @ApiProperty()
  permissionsIds: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  login: string;
}
