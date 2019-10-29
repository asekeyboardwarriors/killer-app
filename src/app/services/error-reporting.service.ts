import { Injectable } from '@angular/core';
import { LoggingService } from '~/app/services/logging.service';
import * as Toast from 'nativescript-toasts';

@Injectable({
    providedIn: 'root'
})
export class ErrorReportingService {

    constructor(private logger: LoggingService) {
    }

    showToUser(message: string): void {
        this.logger.simpleLog(`Error reported. Displaying to user Toast with ${message} as error`);
        Toast.show({
            duration: Toast.DURATION.SHORT,
            position: Toast.POSITION.BOTTOM,
            text: message
        });
    }
}
