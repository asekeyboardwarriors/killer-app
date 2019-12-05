import { Component } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { GeolocationPosition } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { DataPoint, HeatmapData, HeatmapOverlayConfiguration } from 'heatmap.js';
import {
    icon,
    LatLng,
    latLng,
    Layer,
    layerGroup,
    LayerGroup,
    Map as LeafletMap,
    MapOptions,
    Marker,
    marker,
    tileLayer,
    TileLayer
} from 'leaflet';
import { Subscription } from 'rxjs';
import { RadiusModel } from '../Models/geolocation/radius.model';
import { PropertyModel } from '../Models/properties/property-model';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { PropertiesService } from '../services/properties/properties.service';
import { SettingsService } from '../services/Settings/settings.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})

export class HomePage {

    center: LatLng = latLng(46.879966, -121.726909);
    testData: HeatmapData<DataPoint<string, string, string>>;
    cfg: HeatmapOverlayConfiguration<string, string, string>;
    heatmapLayer: any;
    houses: LayerGroup = new LayerGroup<Layer>();
    base: TileLayer;
    options: MapOptions;
    isLoading = false;
    map: LeafletMap;
    layersControl: LeafletControlLayersConfig;
    allPropertiesInRange: PropertyModel[];

    private propertiesListCoordinatesDisplay = new Map<number, string>();
    private _subs: Subscription = new Subscription();
    private _loadingIndicator: HTMLIonLoadingElement;

    constructor(private userLoc: GeoLocationService,
                private userSettings: SettingsService,
                private _propertiesService: PropertiesService,
                private _loader: LoadingController) {

        this.base = tileLayer('https://api.mapbox.com/styles/v1/avalothoath/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
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
            minOpacity: 0,
            scaleRadius: false,
            useLocalExtrema: true,
            blur: 0.5,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            gradient: {
                0.001: '#ffffff',
                0.1: '#ffe6e6',
                0.2: '#ffcccc',
                0.3: '#ffb3b3',
                0.4: '#ff9999',
                0.5: '#ff8080',
                0.6: '#ff6666',
                0.7: '#ff3333',
                0.8: '#ff0000',
                0.9: '#cc0000',
                1: '#800000'
            }
        });
        this.heatmapLayer = new HeatmapOverlay(this.cfg);
        this.testData = {
            max: 1,
            min: 0,
            data: []
        };
        this.houses = layerGroup();
    }

    ionViewWillEnter(): void {
        // Subscribe to user location as defined in settings
        this.isLoading = true;
        this.userLoc.currentLocation().then((pos: GeolocationPosition) => this.getAllPropertiesInRadius(pos.coords.longitude, pos.coords.latitude));
        this._subs = this.userLoc.getCurrentLocationPerTime(this.userSettings.settings.locInterval)
            .subscribe((location: GeolocationPosition) => {
                this.map.panTo(latLng(location.coords.latitude, location.coords.longitude));
            });
        this._loader.create({
            message: 'Please wait 😀!'
        }).then(async overlay => {
            this._loadingIndicator = overlay;
            await overlay.present();
        });

    }

    ionViewWillLeave(): void {
        this._subs.unsubscribe();
    }

    onMapReady(map: LeafletMap): void {
        this.map = map;
        this.map.addLayer(this.heatmapLayer);
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

    getHeatData(): void {

        const myList = this.allPropertiesInRange.map(data =>
            ({
                lat: data.latitude,
                lng: data.longitude,
                count: data.price
            }));

        this.testData = {
            max: 1,
            min: 0,
            data: myList
        };

    }

    getHouseTypeData(): void {
        const myList = this.allPropertiesInRange.map(data =>
            ({
                id: data.id,
                lat: data.latitude,
                lng: data.longitude,
                price: data.price,
                housetype: data.housetype
            }));
        this.houses = layerGroup();
        const markers: Marker[] = [];
        for (const prop of myList) {
            let html = this.propertiesListCoordinatesDisplay.get(prop.lng + prop.lat);
            if (html) {
                html += `<br />Price is: ${prop.price}<br />House type: ${prop.housetype}<hr/>`;
                this.propertiesListCoordinatesDisplay.set(prop.lng + prop.lat, html);
            } else {
                this.propertiesListCoordinatesDisplay.set(prop.lng + prop.lat, `Price is: ${prop.price}<br />House type: ${prop.housetype}<hr/>`);
            }
            const mapMarker = marker([prop.lat, prop.lng], {
                icon: icon({
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    iconUrl: `assets/icon/${prop.housetype}.png`
                })
            });
            markers.push(mapMarker);
            this.houses.addLayer(mapMarker);
        }
        markers.forEach((value: Marker, index) => {
            value.bindPopup(this.propertiesListCoordinatesDisplay.get(value.getLatLng().lng + value.getLatLng().lat), {
                maxHeight: 100
            });
        });
    }

    private getAllPropertiesInRadius(long: number, lang: number): void {
        this._propertiesService
            .getPropertiesInRadius(new RadiusModel(
                this.userSettings.settings.distance,
                long,
                lang)
            )
            .subscribe(async (propertiesInRange: PropertyModel[]) => {
                this.allPropertiesInRange = propertiesInRange;
                this._dismissLoaderIfExists();
                this.getHeatData();
                this.getHouseTypeData();
                this.heatmapLayer.setData(this.testData);
                this.layersControl = {
                    baseLayers: {},
                    overlays: {
                        'Heat Map': this.heatmapLayer,
                        'House Icons': this.houses
                    }
                };
            }, async error => {
                await this._loadingIndicator.dismiss();
            });
    }

    private _dismissLoaderIfExists(): void {
        if (this._loadingIndicator) {
            this._loadingIndicator.dismiss();
        }
    }
}
