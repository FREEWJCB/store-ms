// Tipo que excluye propiedades cuyo valor sea `null` o `undefined`
export type WithoutEmpty<T> = {
    [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
  };

  // Elimina del objeto todas las propiedades con valor `null`, `undefined` o string vacío
  export const withoutEmpty = <T extends object, V = WithoutEmpty<T>>(
    obj: T,
  ): V => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) =>
          !(
            (typeof v === 'string' && !v.length) ||
            v === null ||
            typeof v === 'undefined'
          ),
      ),
    ) as V;
  };
