import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class UpdateFeedbackDto {
  @IsNumber()
  @ApiProperty()
  @ValidateIf(o => o.text)
  rating?: number;

  @ApiProperty()
  @IsString()
  @ValidateIf(o => o.text)
  text?: string;
}
