import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapboxViewApi } from 'nativescript-mapbox';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { interval, Subscription } from 'rxjs';
import * as app from 'tns-core-modules/application';
import { LocationFailureHandling } from '~/app/models/location-failure-handling';
import { LocationService } from '~/app/services/Location/location.service';
import { LoggingService } from '~/app/services/Log/logging.service';
import { UserSettingsService } from '~/app/services/User/user-settings.service';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    private _map: MapboxViewApi;
    private _serverInformSub: Subscription;

    constructor(private locationService: LocationService,
                private logger: LoggingService,
                private userSettings: UserSettingsService) {
        // Use the component constructor to inject providers.
        this.logger.simpleLog('Home Component -- Constructor');
    }

    ngOnInit(): void {
        // Instantiate geoLoc object for map to initalize
        this.logger.multiLog(this, 'Home component -- Init');
        this.locationService.subscribeToLocation();
        this._updateServerLocationOfUser(this.userSettings.userPreferences.locationUpdateFrequency);
    }

    ngOnDestroy(): void {
        console.log('Home -- On Destroy');
        this.locationService.unsubscribeToLocation();
        this._serverInformSub.unsubscribe();
    }

    onDrawerButtonTap(): void {
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }

    onMapReady(args): void {
        this.logger.simpleLog('Map is ready');
        this._map = args.map;
        this._map.addMarkers([
            {
                id: 1,
                lat: this.locationService.location.longitude,
                lng: this.locationService.location.latitude,
                title: 'You are here!',
                subtitle: 'Not your real location, the emulated one :('
            }]);
        this._map.trackUser({
            mode: 'FOLLOW_WITH_HEADING',
            animated: true
        });
    }

    /**
     * @description Fires a request to the server to log the user location
     * @param howOften How often should the request be fired to the server in milliseconds
     */
    private _updateServerLocationOfUser(howOften = 5000): void {
        this.logger.simpleLog(`Tracking user every ${howOften} seconds`);
        this._serverInformSub = interval(howOften).subscribe(next => {
            this.locationService
                .sendLocationToServer(LocationFailureHandling.SILENT_RETRY, this.locationService.location)
                .catch(console.log);
        });
    }

}
