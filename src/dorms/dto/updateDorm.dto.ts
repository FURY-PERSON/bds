import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, ValidateIf } from "class-validator";

export class UpdateDormDto {
  @IsNotEmpty()
  @ValidateIf(o => o.name)
  @IsString()
  @ApiProperty({required: false})
  name?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf(o => o.address)
  @ApiProperty({required: false})
  address?: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @ValidateIf(o => o.phone)
  @ApiProperty({required: false})
  phone?: string

  @IsNotEmpty()
  @IsEmail()
  @ValidateIf(o => o.email)
  @ApiProperty({required: false})
  email?: string

  @ApiProperty({ type: 'string', format: 'binary', required: false})
  image?: Express.Multer.File;
}
