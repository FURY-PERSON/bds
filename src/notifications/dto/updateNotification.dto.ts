import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class UpdateNotificationDto {
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

  @ValidateIf(o => o.link)
  @ApiProperty()
  link?: string;
}
