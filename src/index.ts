import { getPathToFile } from './util';
import { TaskRunner } from './workers/task-runner';

async function start() {
    try {
        const fileName = getPathToFile();
        const taskRunner = new TaskRunner();
        await taskRunner.run(fileName);
    } catch (e) {
        console.error(e);
    }
}

start();
