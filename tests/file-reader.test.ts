import {FileStreamReader} from '../src/util';
import {describe, expect, test, it, beforeEach, afterEach} from '@jest/globals';

const mock = require('mock-fs');
const fileContents = `aa\nba\nab\nabc\nbca\ndsds\naghj`;

beforeEach(() => {
    mock({
        'path': {
            'file.txt': fileContents,
        },
    });
});

afterEach(()=>{
    mock.restore();
});

describe('should read file', () => {
    it('should create file read stream', async () => {
        const fileReader = new FileStreamReader('path/file.txt');
        fileReader.onChunk((data) => {
        });
        let res = await fileReader.readFile();
        expect(fileReader.isFinished).toBe(true);
    });

    it('should read file line by line', async () => {
        const fileReader = new FileStreamReader('path/file.txt');
        let textData: string[] = [];
        fileReader.onChunk((data: string[]) => {
            textData = textData.concat(data);
        });
        await fileReader.readFile();
        expect(textData).toEqual(fileContents.split('\n'));
    });
    
    it('first chunk should contain strings with same length', async () => {
        const fileReader = new FileStreamReader('path/file.txt');
        let textData: string[];
        fileReader.onChunk((data: string[]) => {
            if(!textData){
                textData = data;
            }
        });

        await fileReader.readFile();
        expect(textData).toHaveLength(3);
    });
});

