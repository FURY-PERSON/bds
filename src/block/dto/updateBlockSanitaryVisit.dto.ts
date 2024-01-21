import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, ValidateIf } from "class-validator";

export class UpdateBlockSanitaryVisitDto {
  @ApiProperty()
  @IsDateString()
  @ValidateIf(o => o.date)
  date?: string;
}
