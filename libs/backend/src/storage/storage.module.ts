import { Module } from '@nestjs/common';
import { LocalStorage } from './local.storage';
import { DI_TOKEN } from '@tr/backend/constants/DI';
import { CloudStorage } from './cloud.storage';

@Module({
  providers: [
    {
      provide: DI_TOKEN.STORAGE,
      useFactory: (storageDir) => {
        switch (process.env.STORAGE_PROVIDER) {
          case 'local':
            if (!storageDir) throw new Error('STORAGE_PATH not found in .env');
            return new LocalStorage();
          case 'cloudinary':
            return new CloudStorage();
          default:
            throw new Error(
              `${process.env.STORAGE_PATH} storage is not allowed`,
            );
        }
      },
      inject: [DI_TOKEN.STORAGE_DIR],
    },
    {
      provide: DI_TOKEN.STORAGE_DIR,
      useValue: process.env.STORAGE_PATH,
    },
  ],
  exports: [DI_TOKEN.STORAGE],
})
export class StorageModule {}
