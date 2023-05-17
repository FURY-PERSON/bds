import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateDormDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty()
  phone: string

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image?: Express.Multer.File;
}
