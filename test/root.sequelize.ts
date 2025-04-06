import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ModelCtor } from 'sequelize-typescript';

export const getSequelizeInstance = (models: ModelCtor[]): Sequelize =>
  new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    models: models,
    logging: false,
  });

export const SequelizeTestingModule = (models: ModelCtor[]) => [
  SequelizeModule.forRoot({
    dialect: 'sqlite',
    storage: ':memory:',
    models: models,
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  }),
  SequelizeModule.forFeature(models),
];
