import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray } from "class-validator";

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  dormId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  number: string;
}
