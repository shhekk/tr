import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Range } from '@tr/backend/helpers/decorators';

export class SignupSessionDTO {
  @IsEmail()
  @IsDefined()
  email!: string;
}

export class RegisterDTO {
  @IsEmail()
  @IsDefined()
  email!: string;

  @IsDefined()
  @IsString()
  password!: string;

  @IsString()
  username?: string;
}

export class VerifyOtpDTO {
  @IsEmail()
  @IsDefined()
  email!: string;

  @Type(() => Number)
  @IsNumber()
  @Range(1000, 9999)
  @IsDefined()
  otp!: number;
}

export class CreateUserDTO {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Min(8)
  @Max(16)
  password!: string;
}

export class LoginUserDTO {
  @IsEmail()
  @IsString()
  email?: string;

  @IsString()
  username?: string;

  @IsString()
  @IsDefined()
  password!: string;
}

export class ForgottenPasswordDTO {
  @IsEmail()
  @IsString()
  email?: string;

  // username!: string; //Not allowed for security reasons
}

export class ResetPasswordDTO {
  @Type(() => Number)
  @IsNumber()
  @IsDefined()
  otp!: number;

  @IsString()
  @IsDefined()
  password!: string;
}
