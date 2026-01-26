import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDTO, UpdateUserDTO } from '@tr/dtos/user.dto';
import { AuthHelper } from '@tr/backend/helpers/auth/authHelper';

@Injectable()
export class UserService {
  user: PrismaService['user'];

  constructor(private _prisma: PrismaService) {
    this.user = this._prisma.user;
  }

  async getAllUsers() {
    // passwords can be remove. using findMany({omit: {password: true}})
    // But this file do not care of removing data.
    return await this.user.findMany();
  }

  async getUserByEmail(email: string) {
    // return await this.users.model.findMany()
    return await this.user.findFirst({
      where: { email },
    });
  }

  async getUserById(id: string) {
    // return await this.users.model.findMany()
    return await this.user.findFirst({
      where: { id },
    });
  }

  async createUser(user: CreateUserDTO) {
    // return await this.users.model.findMany()
    const { email, password, username } = user;
    return await this.user.create({
      data: {
        username,
        email,
        password: await AuthHelper.hash(password),
      },
    });
  }

  async updateUser(body: UpdateUserDTO) {
    const { id, password, ...data } = body;
    return this.user.update({
      where: { id },
      data: {
        ...data,
        ...(password ? { password: await AuthHelper.hash(password) } : {}),
      },
      select: {},
    });
  }
}
