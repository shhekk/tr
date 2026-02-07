import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function LoadSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('tr - api')
    .setDescription('tr - api docs')
    .setVersion('1.0.0')
    .build();
  SwaggerModule.setup('api', app, () => {
    return SwaggerModule.createDocument(app, config);
  });
}
