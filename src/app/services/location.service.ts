import { Injectable } from '@angular/core';
import * as geolocation from 'nativescript-geolocation';
import { Observable } from 'rxjs';
import { Accuracy } from 'tns-core-modules/ui/enums';
import { LoggingService } from '~/app/services/logging.service';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private _currentLng: number;
    private _currentLat: number;
    private _location: Location;

    constructor(private logger: LoggingService) {
        //
    }

    sendLocationToServer(): Observable<boolean> {
        // Mock send until server ready
        this.logger.multiLog(this, 'Sending location to server....');

        return new Observable<boolean>((resolver => {
            setTimeout(() => {
                resolver.complete();
            }, 2000);
        }));

    }

    /**
     * @description Prompts the user for GeoLocation Permissions
     */
    requestGeoPermissions(): void {
        this.logger.simpleLog('Requesting geo permissions....');
        geolocation.enableLocationRequest()
            .then(() => {
                this.subscribeToLocation();
            }, e => {
                this.logger.simpleLog(e);
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
        }, e => {
            this.logger.simpleLog('Failed to get geolocation');
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
