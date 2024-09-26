import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  // Turn off swagger in production
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('MonoBackEnd API')
      .setDescription('🦊Monolithic Api Implementation🦊')
      .setVersion('1')
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  app.enableCors({
    origin: [
      'http://artemsoft.com',
      'http://www.artemsoft.com',
      'https://artemsoft.com',
      'https://www.artemsoft.com',
    ],
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
