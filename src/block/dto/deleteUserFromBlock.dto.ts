import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteUserFromBlock {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userLogin: string
}
