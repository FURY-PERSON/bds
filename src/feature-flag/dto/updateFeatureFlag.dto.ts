import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, ValidateIf } from "class-validator";

export class UpdateFeatureFlagDto {
  @IsBoolean()
  @ApiProperty()
  @ValidateIf(o => o.active)
  active?: boolean

  @IsArray()
  @ApiProperty()
  @ValidateIf(o => o.usersLogin)
  usersLogin?: Array<string>
}
