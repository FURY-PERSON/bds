import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsDateString, IsString } from "class-validator";
import { RebukeType } from "../type/rebuke";

export class CreateRebukeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userLogin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  note?: string;

  @IsNotEmpty()
  @IsEnum(RebukeType)
  @ApiProperty()
  type: RebukeType

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  endDate: Date;
}
