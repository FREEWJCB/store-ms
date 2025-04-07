import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { ProductSeeder } from './modules/products/seeders/product.seeder';

export async function getApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    ...(process.env['APP_STAGE'] === 'production' && {
      logger: ['error', 'warn'],
    }),
  });
  return configureApp(app);
}

export function configureApp(app: INestApplication): INestApplication {
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      },
    }),
  );
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  return app;
}

async function bootstrap(): Promise<void> {
  const app = await getApp();

  if (process.argv.includes('--seed') || process.env['SEED_DB'] === 'true') {
    const seeder = app.get(ProductSeeder);
    await seeder.seed();
  }

  const config = new DocumentBuilder()
    .setTitle('Store microservice')
    .setDescription('Microservice to handle store operations')
    .setVersion('1.0')
    .addTag('store')
    .addTag('microservice')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(<string>process.env['APP_PORT'] ?? 3000);
}

bootstrap().then();
