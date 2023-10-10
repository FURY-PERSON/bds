import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray } from "class-validator";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  blockId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  peopleAmount: number;
}
