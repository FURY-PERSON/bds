import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsPhoneNumber, IsArray, ValidateIf } from "class-validator";

export class UpdateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.dormId)
  blockId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.number)
  number?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.subNumber)
  subNumber?: string;
}
