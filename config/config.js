"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var dbConfig = {
    dialect: 'postgres',
    host: process.env['APP_BD_HOST'],
    port: Number(process.env['APP_BD_PORT']),
    username: process.env['APP_BD_USERNAME'],
    password: process.env['APP_BD_PASSWORD'],
    database: "".concat(process.env['APP_BD_NAME'], "_").concat(process.env['APP_STAGE']),
};
exports.default = {
    local: dbConfig,
};
