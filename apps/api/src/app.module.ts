import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AppService } from '~/app.service';
import { ApiModule } from '~/api/api.module';
import { BackendModule } from '@tr/backend/lib/backend.module';

@Module({
  imports: [ApiModule, BackendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
