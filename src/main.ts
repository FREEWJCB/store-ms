import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastify from 'fastify';
import { parseNestedQueryParams } from '@/modules/_global/functions/fastify.query.parser.ts';
import cors from '@fastify/cors';
import { CartSeeder } from '@/modules/carts/seeders/cart.seeder';
import { ProductSeeder } from '@/modules/products/seeders/product.seeder';

// Crea y configura la aplicación NestJS con Fastify
export async function getApp(): Promise<INestApplication> {
  // Instancia de servidor Fastify
  const instance = fastify();

  // Habilita CORS con configuración básica
  await instance.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  // Agrega un hook para parsear queries anidadas
  instance.addHook('onRequest', parseNestedQueryParams);

  // Crea el adaptador de Fastify
  const adapter = new FastifyAdapter(instance);

  // Crea la aplicación Nest con el adaptador y configuración para producción
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      ...(process.env['APP_STAGE'] === 'production' && {
        logger: ['error', 'warn'], // Menos verbose en producción
      }),
    },
  );
  // Devuelve la app con configuración adicional (pipes y filters)
  return configureApp(app);
}

// Configura globalmente la app con pipes y filtros
export function configureApp(app: INestApplication): INestApplication {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma payloads a DTOs
      whitelist: true, // Elimina propiedades que no están en los DTOs
      forbidNonWhitelisted: false, // No lanza error si hay props extras
      transformOptions: {
        enableImplicitConversion: true, // Convierte strings a números, etc.
        exposeUnsetFields: false, // No muestra campos vacíos
      },
    }),
  );
  // Aplica filtro global para errores de validación con i18n
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  return app;
}

// Función principal que arranca el servidor
async function bootstrap(): Promise<void> {
  const app = await getApp();

  // Configura Swagger para documentación
  const config = new DocumentBuilder()
    .setTitle('Store microservice')
    .setDescription('Microservice to handle store operations')
    .setVersion('1.0')
    .addTag('store')
    .addTag('microservice')
    .build();

  // Crea y muestra la documentación Swagger en /doc
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // Inicia el servidor en el puerto especificado o 3000 por defecto
  await app.listen(<string>process.env['APP_PORT'] ?? 3000);

  // Código comentado para ejecutar un seeder opcional
  if (process.argv.includes('--seed') || process.env['SEED_DB'] === 'true') {
    const products = app.get(ProductSeeder);
    await products.seed();
    const carts = app.get(CartSeeder);
    await carts.seed();
  }
}

// Llama a bootstrap para iniciar la app
bootstrap().then();
