import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  roomId: string;
}
