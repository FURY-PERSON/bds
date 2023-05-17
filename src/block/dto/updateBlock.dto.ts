import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray, ValidateIf } from "class-validator";

export class UpdateBlockDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.dormId)
  dormId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.number)
  number?: string;
}
