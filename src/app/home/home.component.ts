import { Component, OnDestroy, OnInit } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { Location } from 'nativescript-geolocation';
import { Mapbox, MapboxMarker, MapboxViewApi } from 'nativescript-mapbox';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { interval, Subscription } from 'rxjs';
import * as app from 'tns-core-modules/application';
import { LocationFailureHandling } from '~/app/models/location-failure-handling';
import { LocationService } from '~/app/services/Location/location.service';
import { LoggingService } from '~/app/services/Log/logging.service';
import { UserSettingsService } from '~/app/services/User/user-settings.service';
// tslint:disable-next-line:no-require-imports
registerElement('Mapbox', () => require('nativescript-mapbox').MapboxView);

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

    location: Location;

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
        this.location = this.locationService.location;
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
        console.log(this.location);
        console.log(this.locationService.location);
        this._map = args.map;
        args.map.setCenter({
            lng: this.locationService.location.longitude,
            lat: this.locationService.location.latitude
        });
        args.map.showUserLocation = true;
        const firstMarker: MapboxMarker = {
            id: 2, // can be user in 'removeMarkers()'
            lat: this.location.latitude, // mandatory
            lng: this.location.longitude, // mandatory
            title: 'One-line title here', // no popup unless set
            subtitle: 'Infamous subtitle!',
            // icon: 'res://cool_marker', // preferred way, otherwise use:
            iconPath: 'res/markers/home_marker.png',
            selected: true   // makes the callout show immediately when the marker is added (note: only 1 marker can be selected at a time)
        };
        args.map.addMarkers([firstMarker]);
        args.map.trackUser({
            mode: 'FOLLOW_WITH_HEADING', // "NONE" | "FOLLOW" | "FOLLOW_WITH_HEADING" | "FOLLOW_WITH_COURSE"
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
                .then(console.log)
                .catch(console.log);
        });
    }
}
