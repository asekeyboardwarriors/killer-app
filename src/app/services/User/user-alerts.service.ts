import { Injectable } from '@angular/core';
import * as Toast from 'nativescript-toasts';
import { LoggingService } from '~/app/services/Log/logging.service';

@Injectable({
    providedIn: 'root'
})
export class UserAlertsService {

    constructor(private logger: LoggingService) {
    }

    showToUser(message: string): void {
        this.logger.simpleLog(`Displaying to user Toast with ${message}`);
        Toast.show({
            duration: Toast.DURATION.LONG,
            position: Toast.POSITION.BOTTOM,
            text: message
        });
    }
}
