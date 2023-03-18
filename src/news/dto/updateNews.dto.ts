import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray, ValidateIf } from "class-validator";

export class UpdateNewsDto {
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

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image: Express.Multer.File;

  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.dormId)
  dormId?: string
}
