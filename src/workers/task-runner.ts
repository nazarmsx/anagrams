import { Worker } from 'worker_threads';
import * as os from 'os';
import * as path from 'path';
import { TextTokenArray, AnagramMap } from '../models';
import { FileStreamReader } from '../util';

export class TaskRunner {

    static readonly MAX_CONCURRENT_TASKS = os.cpus().length - 1;
    private fileReader: FileStreamReader;
    private chunkProcessed: number;
    private activeWorkers: number = 0;
    private pendingWorkersSub: any[] = [];

    constructor() {
    }

    run(fileName: string): Promise<AnagramMap> {
        this.chunkProcessed = 0;
        return new Promise(async (resolve, reject) => {
            this.fileReader = new FileStreamReader(fileName);
            this.fileReader.readFile().then(() => {
            }).catch((err) => {
                console.log(err);
            });
            this.fileReader.onChunk(async (dataChunk) => {
                try {
                    if (this.activeWorkers >= TaskRunner.MAX_CONCURRENT_TASKS) {
                        await new Promise((resolve) => {
                            console.log('resolve');
                            this.pendingWorkersSub.push(resolve)
                        });
                    }
                    
                    this.activeWorkers++;
                    let data = await this.runInWorker(dataChunk);
                    this.logToConsole(data);
                    this.chunkProcessed++;
                    this.activeWorkers--;

                    if (this.pendingWorkersSub.length) {
                        let sub = this.pendingWorkersSub.pop();
                        sub();
                    }

                    if (this.fileReader.isFinished && this.chunkProcessed >= this.getNumberOfTasks) {
                        resolve(null);
                    }

                } catch (err) {
                    this.activeWorkers--;
                    reject(err);
                }
            });
        });
    }

    private runInWorker(data: TextTokenArray): Promise<AnagramMap> {
        return new Promise((resolve, reject) => {
            const worker = new Worker(path.join(__dirname, './worker.js'), {
                workerData: data
            });
            worker.on('message', (data) => {
                resolve(data);
            });
            worker.on('error', (err) => {
                reject(err);
            });
            worker.on('exit', (code) => {

            });
        });
    }

    private get getNumberOfTasks() {
        return this.fileReader.chunkCount;
    }

    protected logToConsole(data: AnagramMap) {
        data.forEach((anagrams) => {
            console.log([...anagrams].join(','));
        })
    }

}
