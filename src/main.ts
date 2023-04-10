import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

export let app: INestApplication;
export const PORT = process.env.PORT || 3000;

async function bootstrap() {
  app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('api');
  app.enableCors({
    exposedHeaders: '*'
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );

  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setVersion('0.0.1')
  .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
  })
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => {
    console.log('Server successfully srarted on port: ' + PORT)
  });
}
bootstrap();
