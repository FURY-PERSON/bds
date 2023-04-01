import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateIf } from "class-validator";

export class UpdateNewsDto {
  @ApiProperty({required: false})
  @ValidateIf(o => o.title)
  title?: string;

  @ApiProperty({required: false})
  @ValidateIf(o => o.subTitle)
  subTitle?: string;

  @ApiProperty({required: false})
  @ValidateIf(o => o.mainText)
  mainText?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image: Express.Multer.File;

  @ApiProperty({required: false})
  @ValidateIf(o => o.dormId)
  dormId?: string
}
