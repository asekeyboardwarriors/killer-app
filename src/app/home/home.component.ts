import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { LocationService } from '~/app/services/location.service';
import { Location } from 'nativescript-geolocation';
import { MapboxViewApi } from 'nativescript-mapbox';
import { Subject } from 'rxjs';

@Component({
    selector: 'Home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    geoLocation: Subject<Location> = new Subject<Location>();
    private map: MapboxViewApi;

    constructor(private locationService: LocationService) {
        // Use the component constructor to inject providers.
        this.locationService.watch();
    }

    ngOnInit(): void {
        // Instantiate geoLoc object for map to initalize
        console.log('Component initialized');
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onMapReady(args): void {
        this.map = args.map;
        this.map.setCenter({
            lat: this.locationService.currentLat,
            lng: this.locationService.currentLng
        });
        this.map.addMarkers([
            {
                id: 1,
                lat: this.locationService.currentLat,
                lng: this.locationService.currentLng,
                title: 'You are here!',
                subtitle: 'Not your real location, the emulated one :('
            }]);
        this.map.trackUser({
            mode: 'FOLLOW_WITH_HEADING',
            animated: true
        });
    }

}
