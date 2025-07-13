import { workerData, parentPort } from 'worker_threads';
import { findAnagrams } from '../util';

export class Worker {
    constructor() {
    }

    public findAnagrams(data: string[]) {
        return findAnagrams(data);
    }
}


try {
    const worker = new Worker();
    const res = worker.findAnagrams(workerData);
    parentPort.postMessage(res);
} catch (e) {
    console.error(e);
    parentPort.close();
}
