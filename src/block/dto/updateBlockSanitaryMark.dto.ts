import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, ValidateIf } from "class-validator";

export class UpdateBlockSanitaryMarkDto {
  @ApiProperty()
  @IsNumber()
  @ValidateIf(o => o.mark)
  mark?: number;
}
