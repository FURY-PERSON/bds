import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray } from "class-validator";

export class CreateNewsDto {
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

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image: Express.Multer.File;

  @IsString()
  @ApiProperty()
  dormId: string
}
