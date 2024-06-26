import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString } from "class-validator";

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

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  reputationBound: number

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image?: Express.Multer.File;
}
