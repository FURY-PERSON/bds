import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { NewsBlock, NewsType } from "../types/types";

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

  @ApiProperty({
    type: String,
    example: '[{"type":"image","src":"src","title":"sdfsdf"},{"type":"text","title":"title","paragraphs":["paragraphs1","sdfsdf2"]},{"type":"code","code":"code"}]'
  })
  @ValidateIf(o => o.blocks)
  blocks: Array<NewsBlock>

  @ApiProperty()
  @ValidateIf(o => o.type)
  @IsEnum(NewsType)
  type:NewsType;
}
