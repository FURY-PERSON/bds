import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsDateString, IsString, ValidateIf } from "class-validator";
import { RebukeType } from "../type/rebuke";

export class UpdateRebuke {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.note)
  note?: string;

  @IsNotEmpty()
  @IsEnum(RebukeType)
  @ApiProperty()
  @ValidateIf(o => o.type)
  type?: RebukeType

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  @ValidateIf(o => o.startDate)
  startDate?: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  @ValidateIf(o => o.endDate)
  endDate?: Date;
}
