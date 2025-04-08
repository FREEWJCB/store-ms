import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import * as modules from '@/modules/_global/config/modules';
export const fallbackLanguage = 'es'; // Idioma predeterminado para i18n u otras configuraciones

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el módulo de configuración esté disponible globalmente
    }),
    // DatabaseModule, // Módulo comentado, posiblemente para reemplazo o refactor

    SequelizeModule.forRoot({
      dialect: 'postgres', // Especifica el dialecto de la base de datos
      host: process.env['APP_BD_HOST']!, // Dirección del host de la BD desde variables de entorno
      port: Number(process.env['APP_BD_PORT']), // Puerto de la base de datos
      username: process.env['APP_BD_USERNAME']!, // Usuario de la BD
      password: String(process.env['APP_BD_PASSWORD']!), // Contraseña de la BD
      database: `${process.env['APP_BD_NAME']}_${process.env['APP_STAGE']}`, // Nombre de la BD + entorno
      models: Object.values(models), // Carga los modelos definidos
      logging: process.env['APP_STAGE'] === 'development', // Activa logs solo en desarrollo
      synchronize: false, // Desactiva sincronización automática con la BD
    }),

    ...Object.values(modules), // Importa dinámicamente todos los módulos definidos
  ],
})
export class AppModule {} // Define el módulo raíz de la aplicación

