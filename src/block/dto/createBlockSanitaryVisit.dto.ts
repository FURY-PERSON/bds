import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateBlockSanitaryVisitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  blockId: string

  @ApiProperty()
  @IsDateString()
  date: string;
}
