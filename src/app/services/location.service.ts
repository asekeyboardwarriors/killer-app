import { Injectable } from '@angular/core';
import * as geolocation from 'nativescript-geolocation';
import { of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { Accuracy } from 'tns-core-modules/ui/enums';
import { ErrorReportingService } from '~/app/services/error-reporting.service';
import { LoggingService } from '~/app/services/logging.service';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private _currentLng: number;
    private _currentLat: number;
    private _location: Location;

    constructor(private logger: LoggingService,
                private errorReporter: ErrorReportingService) {
        //
    }

    sendLocationToServer(): Promise<boolean> {
        // Mock send until server ready

        // What happens if home is not reachable?
        // Perhaps this should be appended to a constant in client side
        // and then it should attempt to again reach the server
        this.logger.multiLog(this, 'Sending location to server....');

        return of(true).pipe(delay(2000)).toPromise().then(() => true);
    }

    /**
     * @description Prompts the user for GeoLocation Permissions
     */
    requestGeoPermissions(): void {
        this.logger.simpleLog('Requesting geo permissions....');
        geolocation.enableLocationRequest()
            .then(() => {
                this.subscribeToLocation();
            }, () => {
                this.errorReporter.showToUser('Permissions where denied, this app cannot run without them');
            });
    }

    /**
     * @description Keeps the current latitude and longitude updated
     */
    subscribeToLocation(): void {
        this.logger.simpleLog('Subscribed to location...');
        geolocation.watchLocation(position => {
            this._currentLat = position.latitude;
            this._currentLng = position.longitude;
        }, (e: Error) => {
            this.errorReporter.showToUser(e.message);
        }, {
            desiredAccuracy: Accuracy.high,
            minimumUpdateTime: 500
        });
    }

    get currentLat(): number {
        return this._currentLat;
    }

    get currentLng(): number {
        return this._currentLng;
    }
}
