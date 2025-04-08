# 🧱 NestJS API - Product Module

Este proyecto es una API construida con NestJS que implementa una arquitectura modular, Sequelize como ORM y pruebas con Jest.

## 🚀 Requisitos

- Node.js >= 18.x
- Yarn o npm
- PostgreSQL

## 📦 Instalación

yarn install
# o
npm install

cp .env.sample .env

### Ejemplo de .env
APP_STAGE=3100
APP_BD_PORT=local
APP_BD_HOST=5432
APP_BD_USERNAME=postgres
APP_BD_PASSWORD=123456
APP_BD_NAME=tienda

nota: al crearla base de datos debe tener el nombre dependiendo de estas variables de entorno APP_BD_NAME y APP_BD_PORT, ya que en su conexionse encuentra el nombre de la base de datos de esta forma: `${APP_BD_NAME}_${APP_BD_PORT}`, entonces si tienes APP_BD_NAME=tienda y APP_BD_PORT=local, entonces el nombre ue debe tener la base de datos es 'tienda_local'
## 🛠️ Comandos de desarrollo

yarn start:dev
# o
npm run start:dev

## ✅ Ejecutar pruebas

yarn test
# o
npm run test

yarn test:watch
# o
npm run test:watch

yarn test:cov
# o
npm run test:cov

## 🌱 Seeder de base de datos

### Compilar el proyecto

yarn build
# o
npm run build

### Ejecutar el seeder

node dist/src/main.js --seed

## 📂 Estructura del Proyecto

src/
├── modules/
│   └── products/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── seeders/
│       └── product.module.ts
├── config/
├── main.ts
└── app.module.ts

## 🧪 Testing con Sequelize

Se utiliza un módulo SequelizeTestingModule que registra todos los modelos necesarios para pruebas unitarias o E2E.

## 📌 Notas adicionales

- Usa rutas absolutas con @ (ver tsconfig.json)
- SequelizeModule.forFeature(...) para modelos por módulo
- Pruebas con @nestjs/testing

## 🧑‍💻 Autor

Este proyecto fue desarrollado por [Tu Nombre o Equipo].

## 🛡️ Licencia

MIT
