import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { shared } from '@tr/shared';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

console.log(shared());
console.log(process.env.DATABASE_URL);

(async function () {
  const PORT = Number(process.env.NOTIFICATION_PORT) ?? 4002;
  const HOST = '0.0.0.0';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: PORT,
        host: HOST,
      },
    },
  );

  await app.listen();
  console.log(`Api Running on: \x1b[1;35m${HOST}:${PORT}\x1b[0m`);
})().catch(() => {
  console.error(`\x1b[1;31mERROR: Failed to start API\x1b[0m`);
  process.exit();
});
