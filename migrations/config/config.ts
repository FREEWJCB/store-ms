import { Dialect } from 'sequelize';
import { config } from 'dotenv';

config();

const dbConfig = {
  dialect: 'postgres' as Dialect,
  host: process.env['APP_BD_HOST']!,
  port: Number(process.env['APP_BD_PORT']),
  username: process.env['APP_BD_USERNAME']!,
  password: process.env['APP_BD_PASSWORD']!,
  database: `${process.env['APP_BD_NAME']}_${process.env['APP_STAGE']}`,
};

export default {
  local: dbConfig,
};
