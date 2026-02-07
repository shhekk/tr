import { ApiPromise } from '../';

export type SignupSession = ApiPromise<{
  retryAfter: number;
}>;

export type VerifyOtp = ApiPromise<{
  retryAfter: number;
}>;

export type Register = ApiPromise<{
  user: any;
}>;

export interface verifyOtp {
  email: string;
  otp: number;
}
