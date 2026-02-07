import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { shared } from '@tr/shared';
import { ValidationPipe } from '@nestjs/common';
import { LoadSwagger } from '@tr/backend/helpers/swagger-loader';

console.log(shared());
console.log(process.env.DATABASE_URL);

(async function () {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // for class-transformer
  LoadSwagger(app);

  const PORT = process.env.API_PORT ?? 4001;
  await app.listen(PORT, () => {
    console.log(
      `Api Running on: \x1b[1;35mhttp://localhost:${PORT}/api/\x1b[0m`,
    );
  });
})().catch(() => {
  console.error(`\x1b[1;31mERROR: Failed to start API\x1b[0m`);
  process.exit();
});
