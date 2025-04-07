import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { parseNestedQueryParams } from './modules/_global/functions/fastify.query.parser.ts';
export async function getApp(): Promise<INestApplication> {
  const instance = fastify();

  // 👇 Aplica el hook que convierte queries anidadas
  instance.addHook('onRequest', parseNestedQueryParams);

  const adapter = new FastifyAdapter(instance);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      ...(process.env['APP_STAGE'] === 'production' && {
        logger: ['error', 'warn'],
      }),
    },
  );
  return configureApp(app);
}

export function configureApp(app: INestApplication): INestApplication {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
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
  // if (process.argv.includes('--seed') || process.env['SEED_DB'] === 'true') {
  //   const seeder = app.get(ProductSeeder);
  //   await seeder.seed();
  // }
}

bootstrap().then();
