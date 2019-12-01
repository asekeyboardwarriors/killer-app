import { Component } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { GeolocationPosition } from '@capacitor/core';
import 'heatmap.js';
import { circle, icon, LatLng, latLng, Layer, layerGroup, LayerGroup, Map, MapOptions, marker, polygon, tileLayer } from 'leaflet';
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
    testData;
    cfg;
    heatmapLayer;
    houses;
    base;
    options: MapOptions;
    mapLayers: LayerGroup = new LayerGroup<Layer>();
    isLoading = false;
    map: Map;
    layersControl: LeafletControlLayersConfig;
    private _subs: Subscription = new Subscription();
    constructor(private userLoc: GeoLocationService,
                private userSettings: SettingsService) {

        const detached = marker([50.8408, -0.1728], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/detached.png'
            })
        }).bindPopup('This is a Detached House');
        const semidetached    = marker([50.838, -0.1], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/semidetached.png'
            })
        }).bindPopup('This is Semi-Detached House');
        const apartment    = marker([50.868, -0.08], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/apartment.png'
            })
        }).bindPopup('This is an Apartment');
        const terrace    = marker([50.858, -0.11], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/terrace.png'
            })
        }).bindPopup('This is a Terraced House');

        this.houses = layerGroup([detached, semidetached, apartment, terrace]);
        this.base = tileLayer('https://api.mapbox.com/styles/v1/avalothoath/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}',{
            attribution: '',
            maxZoom: 18,
            id: 'ck2w16ogc18le1co489mva17t',
            accessToken: 'pk.eyJ1IjoiYXZhbG90aG9hdGgiLCJhIjoiY2sydWY1OWpvMHptMTNtcHZnbnl0YjB0MCJ9.Ryrcvt-TdL-vUH0SzMp2DQ'
        });
        this.options = {
            layers: [this.base],
            zoom: 10,
            center: this.center
        };
        this.cfg = ({
            radius: 20,
            maxOpacity: 0.8,
            scaleRadius: false,
            useLocalExtrema: true,
            blur: 0.95,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            gradient: {
                '.5': 'white',
                '.8': 'pink',
                '.95': 'red'
            }
        });
        this.testData = {
            data: [{lat: 50.8408, lng: -0.1728, count: 2}, {lat: 50.838, lng: -0.1, count: 1}, {lat: 50.868, lng: -0.08, count: 2}, {lat: 50.858, lng: -0.11, count: 3}]
        };
        this.heatmapLayer = new HeatmapOverlay(this.cfg);
        this.heatmapLayer.setData(this.testData);
        this.layersControl = {
            baseLayers: {},
            overlays: {
                'Heatmap': this.heatmapLayer,
                'House Icons': this.houses
            }
        };

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
        this.map.addLayer(this.heatmapLayer)
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
