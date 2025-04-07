export type WithoutEmpty<T> = {
    [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

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
