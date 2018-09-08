import {JStreamBase} from "./JStreamBase";
import Spliterator from "./Spliterator";
import {initWorkers} from "./utils";
import Optional from "./Optional";

export class JStream<T> implements JStreamBase<T> {
    private _entries: Array<T> = [];
    private _chanks: Array<Array<T>> = [];
    private _isParallel: boolean = false;
    private _isSorted: boolean = false;
    private _workers: Array<Worker> = [];
    private _limit: number = 0;
    private _skip: number = 0;
    //_operations: Array<Action> = [];

    constructor(entries: Array<T>) {
        this._entries = entries;
    }

    static of<T>(entries: Array<T>): JStream<T> {
        return new JStream(entries);
    }

    parallel(): JStream<T> {
        this._isParallel = true;
        this._workers = initWorkers(navigator.hardwareConcurrency);
        this._chanks = Spliterator.split(this._entries, (this._entries.length / navigator.hardwareConcurrency) + 1);
        return this;
    }

    sequential(): JStream<T> {
        this._isParallel = false;
        return this;
    }

    sorted(comparator: (a: T, b: T) => number): JStream<T> {
        this._entries = this._entries.sort(comparator);
        this._isSorted = true;
        return this;
    }

    limit(n: number): JStream<T> {
        this._limit = n;
        return this;
    }

    filter(predicate: (entry: T) => boolean): JStream<T> {
        this._entries = this._entries.filter(predicate);
        return this;
    }

    map(mapper: (entry: T) => any): JStream<any> {
        this._entries = this._entries.map(mapper);
        return this;
    }

    skip(n: number): JStream<T> {
        this._skip = n;
        return this;
    }

    findAny(predicate: (entry: T) => boolean): Optional<T> {
        if (this._isParallel) {
            throw new Error('Parallel processing not supported yet');
        } else {
            return _find(this._entries, predicate, this._skip, this._limit);
        }
    }


    findFirst(predicate: (entry: T) => boolean): Optional<T> {
        if (this._isParallel) {
            throw new Error('Parallel processing not supported yet');
        } else {
            return _find(this._entries, predicate, this._skip, this._limit);
        }
    }

    min(comparator: (a: T, b: T) => number): Optional<T> {
        return this._isSorted  ? Optional.of(this._entries[0]) :  Optional.of(this._entries.slice(this._skip, this._limit).sort(comparator)[0]);
    }

    max(comparator: (a: T, b: T) => number): Optional<T>{
        let slicedArr = this._entries.slice(this._skip, this._limit ? this._limit : undefined);
        return Optional.of(slicedArr.sort(comparator)[slicedArr.length - 1]);
    }

    toArray(): Array<T> {
        return this._entries;
    }

    noneMatch(predicate: (entry: T) => boolean): boolean {
        return !(this._entries.slice(this._skip, this._limit ? this._limit : undefined).every(predicate));
    }

    anyMatch(predicate: (entry: T) => boolean): boolean {
        return this._entries.slice(this._skip, this._limit ? this._limit : undefined).some(predicate);
    }

    allMatch(predicate: (entry: T) => boolean): boolean {
        return this._entries.slice(this._skip, this._limit ? this._limit : undefined).every(predicate);
    }

    groupingBy(classifier: (entry: T) => any): Map<any, Array<T>> {
        return _groupingBy(this._entries, classifier, this._skip, this._limit);
    }

    forEach(callback: (entry: T) => void): void {
        if (this._isParallel) {
            this._workers.forEach((w, index) => w.postMessage({
                index,
                chunk: this._chanks[index],
                jsonCallback: JSON.stringify(callback.toString())
            }));
            //throw new Error('Parallel processing not supported yet');
        } else {
            _forEach(this._entries, callback, this._skip, this._limit)
        }
    }

    reduce(reducer: (accumulator: T, currentValue: T) => T, initialValue: T): T {
        return this._entries.reduce(reducer, initialValue);
    };



}


function _forEach<T>(entries: Array<T>, callback: (entry: T) => void, skip: number = 0, limit: number = 0): void {
    limit = limit || entries.length;
    for (let i: number = skip; i < limit; i++) {
        callback(entries[i]);
    }
}

function _find<T>(entries: Array<T>, predicate: (entry: T) => boolean, skip: number = 0, limit: number = 0): Optional<T>{
    limit = limit || entries.length;
    let foundEntry;
    for (let i: number = skip; i < limit; i++) {
        if (predicate(entries[i])) {
            foundEntry = entries[i];
            break;
        }
    }
    return Optional.of(foundEntry);
}


function _groupingBy<T>(entries: Array<T>, classifier: (entry: T) => any, skip: number = 0, limit: number = 0): Map<any, Array<T>> {
    let accumulator = new Map();
    limit = limit || entries.length;

    for (let i: number = skip; i < limit; i++) {
        let key = classifier(entries[i]);
        let entry = accumulator.get(key);
        if (entry) {
            entry.push([entries[i]])
        } else {
            accumulator.set(key, [entries[i]])
        }
    }

    return accumulator;
}