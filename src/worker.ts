import {log} from "./utils";

self.addEventListener('message', ({data}: { data: { index: number, chunk: Array<Object>, jsonCallback: string } }) => {
    log(`[worker] -- ${data.index}`);
    let f: string = JSON.parse(data.jsonCallback);
    let func = initializeCallback(f);
    data.chunk.forEach(v => func(v));
});

const initializeCallback: Function = (callback: string) => new Function('return ' + callback)();