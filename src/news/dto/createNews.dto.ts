import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray, IsEnum } from "class-validator";
import { TreeChildren } from "typeorm";
import { NewsBlockBase } from "../entities/newsBlockBase.entity";
import { NewsBlock, NewsType } from "../types/types";

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

  @ApiProperty({
    type: String,
    example: '[{"type":"image","src":"src","title":"sdfsdf"},{"type":"text","title":"title","paragraphs":["paragraphs1","sdfsdf2"]},{"type":"code","code":"code"}]'
  })
  blocks: Array<NewsBlock>

  @ApiProperty()
  @IsEnum(NewsType)
  type:NewsType;
}
