import { IsDefined, IsString } from 'class-validator';

export class CreateLibraryDTO {
  @IsString()
  @IsDefined()
  name!: string;

  @IsString()
  @IsDefined()
  description!: string;
}
