export const typedEntries = <T extends object>(obj: T) =>
    Object.entries(obj) as [keyof T, T[keyof T]][];

export const typedValues = <T extends object>(obj: T) =>
    Object.values(obj) as T[keyof T][];

export const typedKeys = <T extends object>(obj: T) =>
    Object.keys(obj) as (keyof T)[];
