import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as geolocation from 'nativescript-geolocation';
import { Location } from 'nativescript-geolocation';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { Accuracy } from 'tns-core-modules/ui/enums';
import { LocationFailureHandling } from '~/app/models/location-failure-handling';
import { LocationModel } from '~/app/models/Location/location-backend-model';
import { LocationTransferModel } from '~/app/models/Location/location-transfer-model';
import { UserModel } from '~/app/models/User/user-backend-model';
import { LoggingService } from '~/app/services/Log/logging.service';
import { AuthService } from '~/app/services/User/auth.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private _location: Location;
    private _cache: Array<LocationTransferModel> = [];
    private _locSub: number;
    private readonly URI = 'https://ariasep.herokuapp.com/';

    constructor(private logger: LoggingService,
                private errorReporter: UserAlertsService,
                private http: HttpClient,
                private auth: AuthService) {
        this._location = new Location();
    }

    /**
     * Sends the stored location to the server will handle errors accordingly
     * @param failureHandling How to handle failure
     * @param location The location to send to the server
     */
    sendLocationToServer(failureHandling: LocationFailureHandling = LocationFailureHandling.RETRY_WITH_ERROR,
                         location?: LocationTransferModel | Location): Promise<UserModel> {
        // Mock send until server ready

        // What happens if home is not reachable?
        // Perhaps this should be appended to a constant in client side
        // and then it should attempt to again reach the server
        this.logger.multiLog('Sending location to server....', this.location);

        const user = {
            ...this.auth.cachedUser,
            location: [
                this._getAsSimpleLocation(location)
            ]
        };
        const handleIfError = this.http.patch<UserModel>(this.URI + this.auth.cachedUser.id, user)
            .pipe(catchError(err => {
                this.logger.simpleLog('In Error block');
                // If error check failure handling and act accordingly
                switch (failureHandling) {
                    case LocationFailureHandling.IGNORE_WITH_ERROR:
                        this.errorReporter.showToUser(err);
                        break;
                    case LocationFailureHandling.SILENT_IGNORE:
                        this.logger.simpleLog(err);
                        break;
                    case LocationFailureHandling.RETRY_WITH_ERROR:
                        this.errorReporter.showToUser(err);
                        this._retryAfterTimeout(location);
                        // Retry
                        break;
                    case LocationFailureHandling.SILENT_RETRY:
                        // Retry
                        this._retryAfterTimeout(location);
                        break;
                    default:
                    // ignore
                }

                return throwError(err);
            }));

        return handleIfError.toPromise();
    }

    /**
     * @deprecated Do not use accuire this permissions via the perimissions service!
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
        this._locSub = geolocation.watchLocation(position => {
            this._location.latitude = position.latitude;
            this._location.longitude = position.longitude;
        }, (e: Error) => {
            this.errorReporter.showToUser(e.message);
        }, {
            desiredAccuracy: Accuracy.high,
            minimumUpdateTime: 500
        });
    }

    unsubscribeToLocation(): void {
        geolocation.clearWatch(this._locSub);
    }

    /**
     * @description Tries to post the location to the server after failiture
     * @param location The locations to add to the queue
     * @param timeout after how much time to retry
     */
    private _retryAfterTimeout(location: Location | LocationTransferModel, timeout = 5000): void {
        let id: number;
        if (location instanceof Location) {
            this.logger.simpleLog('Creating retry item...');
            const locationToRetry = new LocationTransferModel();
            locationToRetry.date = moment(moment.now()).utc();
            locationToRetry.location = location;
            id = this._cache.push(locationToRetry);
            locationToRetry.id = id;
            this.logger.multiLog('Created item is: ', locationToRetry);
        } else {
            id = location.id;
        }
        setTimeout(() => {
            const locToRetry = this._cache.find((loc: LocationTransferModel) =>
                loc.id === id);
            this.logger.simpleLog(`Retrying with item id ${id}`);
            this.sendLocationToServer(LocationFailureHandling.SILENT_RETRY, locToRetry).then((user: UserModel) => {
                if (user) {
                    this._cache = this._cache.filter((loc: LocationTransferModel) =>
                        loc.id !== id);
                    this.logger.multiLog(this._cache);
                }
            });
        }, timeout);
    }

    private _getAsSimpleLocation(location: Location | LocationTransferModel): LocationModel {
        if (location instanceof Location) {
            return {
                timestamp: +moment().valueOf(),
                latitude: location.latitude.toString(),
                longitude: location.longitude.toString()
            };
        }

        return {
            longitude: location.location.longitude.toString(),
            latitude: location.location.longitude.toString(),
            timestamp: +moment().valueOf()
        };
    }

    get location(): Location {
        return this._location;
    }

    set location(location: Location) {
        this._location = location;
    }
}
