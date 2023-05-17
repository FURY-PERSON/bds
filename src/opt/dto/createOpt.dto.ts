import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from "class-validator";

export class CreateOptDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  hours: number

  @IsNumber()
  @ApiProperty()
  maxExecutorAmount?: number

  @ApiProperty()
  @ValidateIf(o => o.executorsLogins)
  executorsLogins?: string[]
}
