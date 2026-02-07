export interface StorageService {
  /**
   * @example upload(response, "image.png", "user1234/media")
   * // File saved in  process.env.STORAGE_PATH/user1234/media/image.png */
  upload(
    readable: NodeJS.ReadableStream,
    filename: string,
    folderStructure: string, // upload-dir/username/ogname.png
  ): Promise<{ mediaLink: string }>;

  remove(filePath: string): Promise<boolean>;

  sayHI(): void;
}
