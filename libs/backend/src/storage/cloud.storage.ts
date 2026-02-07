import { StorageService } from './interface';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
/**
 * @notes
 * get filename in Content-Type = image/png
 * or something like that.
 */
export class CloudStorage implements StorageService {
  async upload(
    readable: NodeJS.ReadableStream,
    filename: string = '',
    folderStructure: string = '',
  ) {
    try {
      return { mediaLink: '' };
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong in storageService');
    }
  }
  async remove(filePath: string): Promise<boolean> {
    return false;
  }
  sayHI(): void {
    console.log('hi from Cloud stroage');
  }
}
