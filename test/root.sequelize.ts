// Importa el módulo Sequelize de NestJS, y las clases necesarias de sequelize-typescript
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize, ModelCtor } from 'sequelize-typescript';

// Función que retorna una instancia directa de Sequelize (no del módulo de NestJS) con base en los modelos proporcionados
export const getSequelizeInstance = (models: ModelCtor[]): Sequelize =>
  new Sequelize({
    // Usa SQLite como base de datos para pruebas
    dialect: 'sqlite',
    // Almacena los datos en memoria (no se guarda en disco)
    storage: ':memory:',
    // Registra los modelos usados
    models: models,
    // Desactiva los logs de SQL
    logging: false,
  });

// Función que retorna un arreglo con los módulos necesarios para configurar Sequelize en pruebas
export const SequelizeTestingModule = (models: ModelCtor[]) => [
  // Configura el módulo raíz de Sequelize para pruebas con SQLite en memoria
  SequelizeModule.forRoot({
    dialect: 'sqlite',
    storage: ':memory:',
    models: models,
    autoLoadModels: true, // Carga automáticamente los modelos
    synchronize: true,    // Sincroniza el esquema de la DB automáticamente
    logging: false,       // Desactiva el logging de queries SQL
  }),
  // Registra los modelos en SequelizeModule para inyección de dependencias
  SequelizeModule.forFeature(models),
];
