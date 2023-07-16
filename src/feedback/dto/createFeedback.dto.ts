import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class CreateFeedbackDto {
  @IsNumber()
  @ApiProperty()
  rating: number;

  @ApiProperty()
  @IsString()
  @ValidateIf(o => o.text)
  text?: string;

  @IsString()
  @ApiProperty()
  relatedEntityId: string
}
