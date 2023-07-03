import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class CreateNotificationDto {
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
  link?: string;
}
