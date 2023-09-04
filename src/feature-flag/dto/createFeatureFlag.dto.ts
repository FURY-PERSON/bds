import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean } from "class-validator";

export class CreateFeatureFlagDto {
  @IsString()
  @ApiProperty()
  name: string

  @IsBoolean()
  @ApiProperty()
  active: boolean
}
