import { IsString, IsUrl } from 'class-validator';

export class MediaDTO {
  @IsString()
  id!: string;

  @IsUrl()
  fileURL!: string;
}
