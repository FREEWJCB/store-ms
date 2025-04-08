import { Model, WhereOptions } from 'sequelize';

// Filtra solo las claves de `keys` que existen en la instancia y que no sean `undefined`
export const filterKeysOfInstance = <T extends Record<string, unknown>>(
  instance: T,
  keys: Array<keyof T> = [],
): Array<keyof T> => {
  return keys
    .filter((key) => Object.keys(instance).includes(<string>key))
    .filter((key) => instance[key] !== undefined);
};

// Construye un filtro de consulta Sequelize dinámicamente con una función callback
export const castToQueryFilter = <Entity, T extends Record<string, unknown>>(
  instance: T,
  keys: Array<keyof T> = [],
  callback: (key: keyof T, query: WhereOptions<Entity>) => void,
): WhereOptions<Entity> => {
  const query: WhereOptions<Entity> = {};
  filterKeysOfInstance<T>(instance, keys).forEach((key) => {
    callback(key, query);
  });
  return query;
};

// Verifica si una clave pertenece al modelo Sequelize
export const isKeyOfModel = <T extends Model>(
  model: T,
  key: string | number | symbol,
): key is keyof T => {
  return key in model;
};
