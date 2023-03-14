import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddRolesDto {
  @IsNotEmpty()
  @ApiProperty()
  roles: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
