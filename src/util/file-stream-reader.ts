import * as fs from 'fs';
import { ReadStream } from 'fs';
import { SubFunction, TextTokenArray, CharCode } from '../models';

export class FileStreamReader {
    static readonly BATCH_SIZE = 500;
    private readonly path: string;
    private stream: ReadStream;
    private subscriptions: SubFunction<any>[] = [];
    private chunkNumber: number = 0;
    private isRed: boolean;
    private lineChars: number[] = [];

    constructor(path: string) {
        this.path = path;
    }

    public readFile(): Promise<string[]> {
        this.chunkNumber = 0;
        this.isRed = false;
        return new Promise<string[]>((resolve) => {
            let rows = [];
            this.stream = fs.createReadStream(this.path);
            this.stream.on('data', (chunk) => {
                this.lineChars = [];
                const utilityChars = {
                    [CharCode.CARRIAGE_RETURN]: true
                };
                for (let i = 0; i < chunk.length; ++i) {
                    if (utilityChars[chunk[i]]) {
                        continue;
                    }

                    if (chunk[i] === CharCode.NEW_LINE) {
                        let newLine = String.fromCharCode(...this.lineChars);
                        if (rows.length && newLine.length > rows[rows.length - 1].length) {
                            this.callOnChunk(rows);
                            rows = [];
                        }

                        rows.push(newLine);
                        this.lineChars = [];
                    } else {
                        this.lineChars.push(chunk[i] as number);
                    }
                }
            });

            this.stream.on('close', () => {
                if (this.lineChars.length) {
                    rows.push(String.fromCharCode(...this.lineChars));
                    this.lineChars = [];
                }

                if (rows.length) {
                    this.callOnChunk(rows);
                    this.chunkNumber++;
                }

                this.isRed = true;
                resolve(null);
            });
        });
    }

    private callOnChunk(data: TextTokenArray): void {
        this.subscriptions.forEach((fn) => {
            fn.call(null, data)
        });
    }

    public onChunk(fn: SubFunction<TextTokenArray>): void {
        this.subscriptions.push(fn);
    }

    public get chunkCount(): number {
        return this.chunkNumber;
    }

    public get isFinished(): boolean {
        return this.isRed;
    }
}
