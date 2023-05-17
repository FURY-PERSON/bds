import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEnum, IsDate, IsDateString } from "class-validator";
import { Column } from "typeorm";
import { Shift, WatchStatus } from "../types/enums";

export class CreateWatchDto {
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.title)
  title?: string;

  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.subTitle)
  subTitle: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsEnum(Shift)
  shift: Shift

  @ApiProperty()
  executorLogin?: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  status?: WatchStatus
}
