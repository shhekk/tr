import { StorageService } from './interface';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
/**
 * @notes
 * get filename in Content-Type = image/png
 * or something like that.
 */
export class LocalStorage implements StorageService {
  constructor() {}
  async upload(
    readable: NodeJS.ReadableStream,
    filename: string = '',
    folderStructure: string = '',
  ) {
    try {
      const storageDir = process.env.STORAGE_PATH;

      if (!storageDir) throw new Error('STORAGE_PATH not found in .env');

      await fs.promises.mkdir(path.resolve(storageDir, folderStructure), {
        recursive: true,
      });

      const mediaLink = path.join(
        storageDir,
        folderStructure,
        filename ?? crypto.randomUUID(),
      );

      const writeStream = fs.createWriteStream(mediaLink);

      // readable.pipe(writeStream); // do not awaits - function may return while the file is still being written

      await new Promise<void>((res, rej) =>
        readable
          .on('error', rej) // client failed (user canceled midway, network failure)
          .pipe(writeStream) // avoids half generated file
          .on('error', rej) // server failed (permission denied, unAvailable storage)
          .on('finish', res),
      );

      // (await import('node:stream/promises')).pipeline(readable, writeStream); // easy tweak of above methods

      return { mediaLink };
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in storageService');
    }
  }

  async remove() {
    return false;
  }

  sayHI(): void {
    console.log('hi from local stroage');
  }
}
