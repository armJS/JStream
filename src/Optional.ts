export interface OptionalBase<T> {
    get(): T | void;

    orElse(value: any): any;
}

export default class Optional<T> implements OptionalBase<T> {
    _value?: T | void;

    constructor(value?: T) {
        this._value = value;
    }

    static of<T>(value?: T): Optional<T> {
        return new Optional(value);
    }

    static empty(): Optional<void>{
        return new Optional();
    }

    get(): T | void {
        return this._value;
    }

    orElse(value: any): any {
        return this._value || value;
    }
}