///<reference path="../node_modules/@types/jest/index.d.ts"/>

import {JStream} from "../src/JStream";
import {createIntArray} from "./testDataSupplier";


test('forEach', () => {
    const mockCallback = jest.fn();
    JStream.of(createIntArray(5)).skip(2).forEach(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(3);
});

test('anyMatch', () => {
    const result = JStream.of(createIntArray(3)).findAny(v => v === 1).get();
    expect(result).toBe(1);

    const result2 = JStream.of(createIntArray(3)).findAny(v => v === 5).orElse("not found");
    expect(result2).toBe("not found");
});

test('partitioningBy', () => {
    let result: Map<boolean, Array<number>> = JStream.of(createIntArray(20))
        .limit(12).partitioningBy(v => v > 6);
    // @ts-ignore
    expect(result.get(false).length).toBe(7);
});

test('groupingBy', () => {
    let result: Map<number, Array<number>> = JStream.of(createIntArray(20))
        .limit(12).groupingBy(v => v % 2);
    // @ts-ignore
    expect(result.get(0).length).toBe(6);
});
