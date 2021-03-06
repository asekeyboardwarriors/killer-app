import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    flat: LayerGroup = new LayerGroup<Layer>();
    terraced: LayerGroup = new LayerGroup<Layer>();
    detached: LayerGroup = new LayerGroup<Layer>();
    semidetached: LayerGroup = new LayerGroup<Layer>();
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
                private _loader: LoadingController,
                private domSanitizer: DomSanitizer
    ) {

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
        this.configureHeatmap();
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

    configureHeatmap(): void {
        const redgradient: { [key: string]: string } = {
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
        };
        const altgradient: { [key: string]: string } = {
            0: 'Navy',
            0.25: 'Blue',
            0.5: 'Green',
            0.75: 'Yellow',
            1: 'Red'
        };
        const localExtrema = this.userSettings.settings.localExtrema;
        const gradientBool = this.userSettings.settings.gradientBool;
        console.log(gradientBool)
        let grad: { [key: string]: string };
        if (gradientBool === true) {
            grad = altgradient;
        } else {
            grad = redgradient;
        }
        this.cfg = ({
            radius: 20,
            maxOpacity: 0.8,
            minOpacity: 0,
            scaleRadius: false,
            useLocalExtrema: localExtrema,
            blur: 0.5,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            gradient: grad
        });
        this.heatmapLayer = new HeatmapOverlay(this.cfg);
    }

    getHeatData(): void {

        const myList = this.allPropertiesInRange.map(data =>
            ({
                lat: data.latitude,
                lng: data.longitude,
                count: data.price
            }));

        this.testData = {
            max: Math.max(...myList.map(s => s.count)),
            min: Math.min(...myList.map(s => s.count)),
            data: myList
        };
    }

    getHouseTypeData(): void {
        let myList = this.allPropertiesInRange.map(data =>
            ({
                date: data.date,
                id: data.id,
                lat: data.latitude,
                lng: data.longitude,
                price: data.price,
                housetype: data.housetype
            }));
        this.terraced = layerGroup();
        this.semidetached = layerGroup();
        this.detached = layerGroup();
        this.flat = layerGroup();
        const markers: Marker[] = [];
        for (const prop of myList) {
            let html = this.propertiesListCoordinatesDisplay.get(prop.lng + prop.lat);
            if (html) {
                html += `<br />Date Sold: ${prop.date},<br />Price: £${prop.price}<br />House type: ${prop.housetype}<hr/>`;
                this.propertiesListCoordinatesDisplay.set(prop.lng + prop.lat, html);
            } else {
                this.propertiesListCoordinatesDisplay.set(prop.lng + prop.lat, `Date Sold: ${prop.date}<br />Price: £${prop.price}<br />House Type: ${prop.housetype}<hr/>`);
            }
            const mapMarker = marker([prop.lat, prop.lng], {
                icon: icon({
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    iconUrl: `assets/icon/${prop.housetype}.png`
                })
            });
            markers.push(mapMarker);
            switch (prop.housetype) {
                case 'Detached': {
                    this.detached.addLayer(mapMarker);
                    break;
                }
                case 'Flat': {
                    this.flat.addLayer(mapMarker);
                    break;
                }
                case 'Semi-detached': {
                    this.semidetached.addLayer(mapMarker);
                    break;
                }
                case 'Terraced': {
                    this.terraced.addLayer(mapMarker);
                    break;
                }
            }
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
                this.configureHeatmap();
                this.layersControl = {
                    baseLayers: {},
                    overlays: {
                        'Detached Houses': this.detached,
                        'Semi-Detached Houses': this.semidetached,
                        'Flats': this.flat,
                        'Terraced Houses': this.terraced
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
