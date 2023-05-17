import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, ValidateIf, IsEnum } from "class-validator";
import { OptStatus } from "../types/enums";

export class UpdateOptDto {
  @ValidateIf(o => o.title)
  @IsString()
  @ApiProperty()
  title?: string;

  @ValidateIf(o => o.subTitle)
  @IsString()
  @ApiProperty()
  subTitle?: string;

  @ApiProperty()
  @ValidateIf(o => o.hours)
  @IsNumber()
  hours?: number

  @IsNumber()
  @ValidateIf(o => o.maxExecutorAmount)
  @ApiProperty()
  maxExecutorAmount?: number;

  @IsEnum(OptStatus)
  @ValidateIf(o => o.status)
  @ApiProperty()
  status?: OptStatus

  @ApiProperty()
  @ValidateIf(o => o.executorsLogins)
  executorsLogins?: string[]
}
