import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddPermissionsDto {
  @IsNotEmpty()
  @ApiProperty()
  permissions: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
