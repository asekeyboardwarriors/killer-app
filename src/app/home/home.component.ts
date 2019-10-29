import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapboxViewApi } from 'nativescript-mapbox';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { LocationService } from '~/app/services/location.service';
import { LoggingService } from '~/app/services/logging.service';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    private _map: MapboxViewApi;
    private _serverInformSub: number;

    constructor(private locationService: LocationService,
                private logger: LoggingService) {
        // Use the component constructor to inject providers.
        this.logger.simpleLog('Home Component -- Constructor');
    }

    ngOnInit(): void {
        // Instantiate geoLoc object for map to initalize
        this.logger.multiLog(this, 'Home component -- Init');
        this.locationService.subscribeToLocation();
    }

    ngOnDestroy(): void {
        clearInterval(this._serverInformSub);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }

    onMapReady(args): void {
        this.logger.simpleLog('Map is ready');
        this._map = args._map;
        this._map.setCenter({
            lat: this.locationService.currentLat,
            lng: this.locationService.currentLng
        });
        this._map.addMarkers([
            {
                id: 1,
                lat: this.locationService.currentLat,
                lng: this.locationService.currentLng,
                title: 'You are here!',
                subtitle: 'Not your real location, the emulated one :('
            }]);

        this._map.trackUser({
            mode: 'FOLLOW_WITH_HEADING',
            animated: true
        });
    }

    private _updateServerLocationOfUser(howOften = 60): void {
        this._serverInformSub = setInterval(() => {
            this.locationService.sendLocationToServer()
                .then();
        }, howOften);
    }

}
