import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  const origin = envService.get('FRONTEND_BASE_URL');

  app.enableCors({
    origin: [origin],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
