///<reference path="../node_modules/@types/jest/index.d.ts"/>

import {JStream} from "../src/JStream";
import {createIntArray} from "./testDataSupplier";


test('forEach', () => {
    const mockCallback = jest.fn();
    JStream.of(createIntArray(5)).skip(2).forEach(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(3);
});