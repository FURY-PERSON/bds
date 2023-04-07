import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @ApiProperty()
  title?: string;

  @IsString()
  @ApiProperty()
  subTitle?: string;

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
