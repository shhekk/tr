import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './routes/auth.controller';
import { BookController } from './routes/book.controller';
import { LibraryController } from './routes/library.controller';
import { UserController } from './routes/user.controller';
import { DatabaseModule } from '@tr/backend/database/database.module';

const Authenticated = [BookController, LibraryController, UserController];

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController, ...Authenticated],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(...authMiddleware).forRoutes(...Authenticated)
  }
}
