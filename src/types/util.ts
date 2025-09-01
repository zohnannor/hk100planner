type Contra<T> = T extends any ? (arg: T) => void : never;

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never;

type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>;

export type UnionToArray<T> = PickOne<T> extends infer U
    ? Exclude<T, U> extends never
        ? [T] extends [never]
            ? []
            : [T]
        : [...UnionToArray<Exclude<T, U>>, U]
    : never;

type Split<T, K extends keyof T> = K extends unknown
    ? { [I in keyof T]: I extends K ? T[I] : never }
    : never;

type Explode<T> = Split<T, keyof T>;

type AtMostOne<T> = Explode<Partial<T>>;

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
    U[keyof U];

export type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>;
