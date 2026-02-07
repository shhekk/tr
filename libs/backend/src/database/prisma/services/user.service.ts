import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDTO } from '@tr/backend/dtos/auth.dto';
import { AuthHelper } from '@tr/backend/auth/auth.helpers';
import { User } from '@tr/db';

@Injectable()
export class UserService {
  user: PrismaService['user'];

  constructor(private _prisma: PrismaService) {
    this.user = this._prisma.user;
  }

  async isEmailTaken(email: string) {
    // return !!(await this.user.findUnique({ where: { email } }));
    return (await this.user.count({ where: { email } })) > 0;
  }

  async isUsernameTaken(username: string) {
    return !!(await this.user.findUnique({ where: { username } }));
  }

  async getAllUsers() {
    // passwords can be remove. using findMany({omit: {password: true}})
    // But this file do not care of removing data.
    return await this.user.findMany();
  }

  getUserByEmail(email: string) {
    // return await this.users.model.findMany()
    return this.user.findFirst({
      where: { email },
    });
  }

  getUserById(id: string) {
    // return await this.users.model.findMany()
    return this.user.findFirst({
      where: { id },
    });
  }

  getUserByEmailorUsername(
    providerName: User['providerName'],
    email?: string,
    username?: string,
  ) {
    if (!email && !username)
      throw new Error('Either email or username is required');

    return this.user.findUnique({
      where: {
        ...(email
          ? {
              email_providerName: {
                email,
                providerName,
              },
            }
          : { username }),
      },
    });
  }

  async createUser(user: RegisterDTO & { refresh: string }) {
    try {
      // return await this.users.model.findMany()
      const { password, ...others } = user;
      return await this.user.create({
        data: {
          ...others,
          // providerId: '1',
          providerName: 'LOCAL',
          username: undefined,
          password: await AuthHelper.hash(password),
        },
        select: {
          id: true,
        },
      });
    } catch (e: any) {
      console.error('Error while creating user\nprisma error code: ', e);
      if (e.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new Error('Something went Wrong');
    }
  }

  async updateRefreshToken({
    email,
    providerName,
    refresh,
  }: {
    email: string;
    providerName: User['providerName'];
    refresh: User['refresh'];
  }) {
    return this.user.update({
      where: {
        email_providerName: {
          email,
          providerName,
        },
      },
      data: { refresh },
    });
  }

  async updateUserDetails(id: string, body: Partial<User>) {
    const { password, ...data } = body;
    return this.user.update({
      where: { id },
      data: {
        ...data,
        ...(password ? { password: await AuthHelper.hash(password) } : {}),
      },
    });
  }
}
