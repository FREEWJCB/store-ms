import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
export const fallbackLanguage = 'es';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // DatabaseModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env['APP_BD_HOST']!,
      port: Number(process.env['APP_BD_PORT']),
      username: process.env['APP_BD_USERNAME']!,
      password: String(process.env['APP_BD_PASSWORD']!),
      database: `${process.env['APP_BD_NAME']}_${process.env['APP_STAGE']}`,
      models: [],
      logging: process.env['APP_STAGE'] === 'development',
      synchronize: false,
    }),
  ],
})
export class AppModule {}
