import { Component } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { GeolocationPosition } from '@capacitor/core';
import { circle, LatLng, latLng, Layer, LayerGroup, Map, MapOptions, polygon, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { SettingsService } from '../services/Settings/settings.service';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})

export class HomePage {
    center: LatLng = latLng(46.879966, -121.726909);
    options: MapOptions;
    mapLayers: LayerGroup = new LayerGroup<Layer>();
    isLoading = false;
    map: Map;
    layersControl: LeafletControlLayersConfig;

    private _subs: Subscription = new Subscription();

    constructor(private userLoc: GeoLocationService,
                private userSettings: SettingsService) {
        this.options = {
            layers: [tileLayer('https://api.mapbox.com/styles/v1/avalothoath/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: '',
                maxZoom: 18,
                id: 'ck2w16ogc18le1co489mva17t',
                accessToken: 'pk.eyJ1IjoiYXZhbG90aG9hdGgiLCJhIjoiY2sydWY1OWpvMHptMTNtcHZnbnl0YjB0MCJ9.Ryrcvt-TdL-vUH0SzMp2DQ'
            })],
            zoom: 10,
            center: this.center
        };
        this.layersControl = {
            baseLayers: {},
            overlays: {
                'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
                'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
            }
        }

    }

    ionViewWillEnter(): void {
        // Subscribe to user location as defined in settings
        console.log('Ion Enter');
        this.isLoading = true;
        this._subs = this.userLoc.getCurrentLocationPerTime(this.userSettings.settings.locInterval)
            .subscribe((location: GeolocationPosition) => {
                console.log(location);
                this.map.panTo(latLng(location.coords.latitude, location.coords.longitude));
            });
    }

    ionViewWillLeave(): void {
        this._subs.unsubscribe();
    }

    onMapReady(map: Map): void {
        this.map = map;
        this.userLoc.currentLocation()
            .then((geoObject: GeolocationPosition) => {
                this.map.panTo(latLng(geoObject.coords.latitude, geoObject.coords.longitude));
                // This is needed here as map will not render correctly without it
                setTimeout(() => {
                    map.invalidateSize();
                }, 1000);
            }).catch(e => {
            console.log('Failed with error');
            console.log(e);
        });
    }
}
