export function log(v: any) {
    console.log(v);
}

export function initWorkers(coreCount: number): Array<Worker> {
    let workers: Array<Worker> = [];
    if (coreCount > 1) {
        for (let i = 0; i < coreCount; i++) {
            workers.push(new Worker('./worker.js'));
        }
    }
    return workers;
}