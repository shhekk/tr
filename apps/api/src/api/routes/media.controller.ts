import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { StorageService } from '@tr/backend/storage/interface';
import { DI_TOKEN } from '@tr/backend/constants/DI';

@Controller('media')
export class MediaController {
  constructor(
    @Inject(DI_TOKEN.STORAGE) private readonly Storage: StorageService,
  ) {}

  @Get('/hi')
  sayHI() {
    this.Storage.sayHI();
    return;
  }

  @Post('/upload')
  uploadFile() {}

  @Delete('/remove')
  removeFile(@Body('filePath') filePath: string) {
    return this.Storage.remove(filePath);
  }
}
