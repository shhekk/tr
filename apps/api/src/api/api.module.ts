import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './routes/auth.controller';
import { BookController } from './routes/book.controller';
import { LibraryController } from './routes/library.controller';
import { UserController } from './routes/user.controller';
import { MediaController } from './routes/media.controller';
import { DatabaseModule } from '@tr/backend/database/database.module';
import { StorageModule } from '@tr/backend/storage/storage.module';
import { RedisService } from '@tr/backend/redis/redis.service';
import { AuthMiddleware, AuthGuard, AuthService } from '@tr/backend/auth';

const Authenticated = [
  BookController,
  LibraryController,
  UserController,
  MediaController,
];

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [AuthController, ...Authenticated],
  providers: [RedisService, AuthService, AuthGuard],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...Authenticated);
  }
}
