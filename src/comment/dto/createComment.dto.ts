import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subTitle: string;

  @IsString()
  @ApiProperty()
  mainText: string;

  @ApiProperty()
  @IsNumber()
  @ValidateIf(o => o.rating)
  rating?: number;

  @IsString()
  @ApiProperty()
  relatedEntityId: string
}
