import { Injectable } from '@angular/core';
import * as Toast from 'nativescript-toasts';
import { LoggingService } from '~/app/services/logging.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorReportingService {

    constructor(private logger: LoggingService) {
    }

    showToUser(message: string): void {
        this.logger.simpleLog(`Error reported. Displaying to user Toast with ${message} as error`);
        Toast.show({
            duration: Toast.DURATION.LONG,
            position: Toast.POSITION.BOTTOM,
            text: message
        });
    }
}
