import { IsDefined, IsEmail, IsNumber, IsString, IsIn } from 'class-validator';
import { Range } from '@tr/backend/helpers/decorators/Range';
import { verifyOtp } from '@tr/types/api/auth.type';
import { Type } from 'class-transformer';

// export class RegisterDTO {
//   @IsEmail()
//   @IsDefined()
//   email!: string;

//   @IsString()
//   @IsDefined()
//   password!: string;

//   @IsString()
//   username?: string;
// }

// export class VerifyOtpDTO implements verifyOtp {
//   @IsEmail()
//   @IsDefined()
//   email!: string;

//   @Type(() => Number)
//   @IsNumber()
//   @IsDefined()
//   otp!: number;
// }

export class UpdateUserDTO {
  @IsString()
  username?: string;
  @IsString()
  password?: string;
}
