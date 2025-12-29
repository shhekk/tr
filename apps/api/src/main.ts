import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT ?? 4001;
  await app.listen(PORT, () => {
    console.log(`Api Running on: \x1b[1;35mhttp://localhost:${PORT}/\x1b[0m`);
  });
})().catch(() => {
  console.error(`\x1b[1;31mERROR: Failed to start API\x1b[0m`);
  process.exit();
});
