import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsDateString, IsString } from "class-validator";
import { ScientificWorkType } from "../types/scientificWorks";

export class CreateScientificWorksDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  creatorLogin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsEnum(ScientificWorkType)
  @ApiProperty()
  type: ScientificWorkType

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  date: Date
}
