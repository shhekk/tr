import { Module } from '@nestjs/common';
import { AuthController } from './routes/auth.controller';
import { BookController } from './routes/book.controller';
import { LibraryController } from './routes/library.controller';
import { UserController } from './routes/user.controller';
// import { PrismaModule } from '@tr/nestjs-libraries';

const authenticated = [BookController, LibraryController, UserController];

@Module({
  // imports: [PrismaModule],
  controllers: [AuthController, ...authenticated],
})
export class ApiModule {
  //   get controllers() { return [...authenticated, AuthController]; }
}
