import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsDateString, IsString, ValidateIf } from "class-validator";
import { ScientificWorkType } from "../types/scientificWorks";

export class UpdateScientificWorksDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.creatorLogin)
  creatorLogin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.title)
  title: string;

  @IsNotEmpty()
  @IsEnum(ScientificWorkType)
  @ApiProperty()
  @ValidateIf(o => o.type)
  type: ScientificWorkType

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  @ValidateIf(o => o.date)
  date: Date
}
