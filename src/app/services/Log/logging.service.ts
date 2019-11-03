import { Injectable } from '@angular/core';
import { File, Folder, knownFolders } from 'tns-core-modules/file-system';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    private _environment: 'dev' | 'prod';
    private _jsonFile: File;

    constructor() {
        const documents: Folder = knownFolders.documents() as Folder;
        const folder: Folder = documents.getFolder('domFolder') as Folder;
        this._jsonFile = folder.getFile('extra.json');
    }

    /**
     * Write user logs to mobile storage
     * @param obj the JSON object to write
     */
    writeToFileAsJsonAsync(obj: {}): Promise<string> {
        return this._jsonFile.writeText(JSON.stringify(obj));
    }

    /**
     * Read the user logs from a file
     */
    readFromFileAsJsonAsync(): Promise<string> {
        return this._jsonFile.readText();
    }

    /**
     * Write a simple log to the console
     * @param message Display message
     */
    simpleLog(message: string | number): void {
        if (this.environment === 'dev') {
            console.log(`CustomLog: ${message}`);
        }
    }

    /**
     * Write a multiline / object message to the console
     * @param message The objects to display
     */
    multiLog(...message): void {
        console.log('CustomLog: BEGIN \n');
        if (this.environment === 'dev') {
            message.forEach(m => {
                console.log(m);
                console.log('\n');
            });
        }
        console.log('CustomLog: END \n');
    }

    get environment(): 'dev' | 'prod' {
        return this._environment;
    }

    set environment(value: 'dev' | 'prod') {
        this._environment = value;
    }
}
