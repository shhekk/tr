import { MediaDTO } from '@tr/dtos/media.dto';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Range } from '@tr/backend/helpers/decorators/Range';

export class CreateUserDTO {
  @IsString()
  @Range(3, 15)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Range(3, 15)
  password!: string;

  @IsOptional()
  profile?: MediaDTO;

  @IsOptional()
  @IsString()
  provider?: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsDefined()
  id!: string;
}
