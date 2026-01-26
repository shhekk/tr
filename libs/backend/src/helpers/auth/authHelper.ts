import bcrypt from 'bcrypt';

export class AuthHelper {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
