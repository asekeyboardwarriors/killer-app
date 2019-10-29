import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    private _environment: 'dev' | 'prod';

    simpleLog(message: string): void {
        if (this.environment === 'dev') {
            console.log(`CustomErrorLog: ${message}`);
        }
    }

    multiLog(...message): void {
        console.log('CustomErrorLog: BEGIN \n');
        if (this.environment === 'dev') {
            message.forEach(m => {
                console.log(m);
                console.log('\n');
            });
        }
        console.log('CustomErrorLog: END \n');
    }

    get environment(): 'dev' | 'prod' {
        return this._environment;
    }

    set environment(value: 'dev' | 'prod') {
        this._environment = value;
    }
}
