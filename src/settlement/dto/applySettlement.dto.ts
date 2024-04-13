import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { SettlementResultStudent } from "../types/applySettlement";

export class ApplySettlementDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  dormId: string

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  students: Array<SettlementResultStudent>
}
