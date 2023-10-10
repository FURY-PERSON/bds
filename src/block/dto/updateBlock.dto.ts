import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateIf, IsNumber } from "class-validator";

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

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @ValidateIf(o => o.floor)
  floor?: number;
}
