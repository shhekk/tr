import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@tr/db';
import { DI_TOKEN } from '@tr/backend/constants/DI';
import { StorageService } from '@tr/backend/storage/interface';

@Injectable()
export class MediaService {
  private media: PrismaService['media']; // prisma Media delegate
  constructor(
    prisma: PrismaService,
    @Inject(DI_TOKEN.STORAGE) private readonly Storage: StorageService,
  ) {
    this.media = prisma.media;
  }

  async getAll() {
    this.media;
    this.Storage.sayHI();
    return;
    // return await this.media.findMany();
  }
}
