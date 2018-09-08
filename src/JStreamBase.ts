import Optional from "./Optional";

export interface JStreamBase<T> {
    filter(predicate: (entry: T) => boolean): JStreamBase<T>;

    map<U>(mapper: <U>(entry: T) => JStreamBase<U>): JStreamBase<U>;

    sorted(comparator: (a: T, b: T) => number): JStreamBase<T>;

    limit(n: number): JStreamBase<T>;

    skip(n: number): JStreamBase<T>;

    findAny(predicate: (entry: T) => boolean): Optional<T>;

    findFirst(predicate: (entry: T) => boolean): Optional<T>;

    allMatch(predicate: (entry: T) => boolean): boolean;

    anyMatch(predicate: (entry: T) => boolean): boolean;

    noneMatch(predicate: (entry: T) => boolean): boolean;

    max(comparator: (a: T, b: T) => number): Optional<T>;

    min(comparator: (a: T, b: T) => number): Optional<T>;

    toArray(): Array<T>;

    forEach(callback: (entry: T) => void): void;

    reduce(reducer: (accumulator: T, currentValue: T) => T, initialValue: T): T;
}