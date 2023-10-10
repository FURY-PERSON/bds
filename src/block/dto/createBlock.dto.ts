import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  dormId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  number: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  floor: number;
}
