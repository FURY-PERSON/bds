import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.title)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.subTitle)
  subTitle?: string;

  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.mainText)
  mainText?: string;

  @ApiProperty()
  @IsNumber()
  @ValidateIf(o => o.rating)
  rating?: number;
}
