import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsEnum, IsDate, IsDateString } from "class-validator";
import { Column } from "typeorm";
import { Shift, WatchStatus } from "../types/enums";

export class UpdateWatchDto {
  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.title)
  title?: string;

  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.subTitle)
  subTitle?: string;

  @ApiProperty()
  @Column()
  @IsEnum(Shift)
  @ValidateIf(o => o.shift)
  shift?: Shift

  @ApiProperty()
  @ValidateIf(o => o.executorLogin)
  executorLogin?: string;

  @ApiProperty()
  @IsDateString()
  @ValidateIf(o => o.date)
  date?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(o => o.creatorLogin)
  creatorLogin?: string

  @ApiProperty()
  @ValidateIf(o => o.status)
  status?: WatchStatus
}
