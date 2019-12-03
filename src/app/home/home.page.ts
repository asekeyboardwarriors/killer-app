import { Component } from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { GeolocationPosition } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { DataPoint, HeatmapData, HeatmapOverlayConfiguration } from 'heatmap.js';
import { icon, LatLng, latLng, Layer, layerGroup, LayerGroup, Map, MapOptions, marker, tileLayer, TileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { PropertyModel } from '../Models/properties/property-model';
import { HeatDataModel } from '../Models/propertyData/heatData.model';
import { HouseTypeDataModel } from '../Models/propertyData/houseTypeData.model';
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
    map: Map;
    layersControl: LeafletControlLayersConfig;
    allPropertiesInRange: PropertyModel[];

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
                0.001: 'white',
                0.8: 'pink',
                0.95: 'blue'
            }
        });
        this.heatmapLayer = new HeatmapOverlay(this.cfg);
        this.testData = {
            max: 1,
            min: 0,
            data: []
        };
        this.houses = layerGroup();
        // this.getHeatTestData();
        // this.getHouseTypeTestData();
        this.layersControl = {
            baseLayers: {},
            overlays: {
                'Heat Map': this.heatmapLayer,
                'House Icons': this.houses
            }
        };
    }

    ionViewWillEnter(): void {
        // Subscribe to user location as defined in settings
        this.isLoading = true;
        this._subs = this.userLoc.getCurrentLocationPerTime(this.userSettings.settings.locInterval)
            .subscribe((location: GeolocationPosition) => {
                console.log(location);
                this.map.panTo(latLng(location.coords.latitude, location.coords.longitude));
            });
        this._loader.create({
            message: 'Please wait 😀!'
        }).then(async overlay => {
            this._loadingIndicator = overlay;
            await overlay.present();
        });
        this._propertiesService.getRandomProperties()
            .subscribe(async (propertiesInRange: PropertyModel[]) => {
                this.allPropertiesInRange = propertiesInRange;
                await this._loadingIndicator.dismiss();
                // console.log('ion: ', this.allPropertiesInRange);
                this.getHeatData();
                this.getHouseTypeData();
                this.houses.addTo(this.map);
                this.heatmapLayer.setData(this.testData);
                console.log('test: ', this.houses);
            }, async error => {
                await this._loadingIndicator.dismiss();
            });

    }

    ionViewWillLeave(): void {
        this._subs.unsubscribe();
    }

    onMapReady(map: Map): void {
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

        const myList = this.allPropertiesInRange.map(data => {
            return {
                lat: data.latitude,
                lng: data.longitude,
                count: data.price
            };
        });

        this.testData = {
            max: 1,
            min: 0,
            data: myList
        };

    }

    getHeatTestData(): void {
        // let hTestData: HeatDataModel[] = [] ;
        //
        // for (let i=0; i<5000; i++) {
        //     hTestData.push({
        //         lat: (Math.random() + 50),
        //         lng: 0 - Math.random(),
        //         price: (Math.random() + 1) * 50000
        //     });
        // }
        //
        // let dataMax = Math.max(...hTestData.map(d => d.price));
        // hTestData = hTestData.map(data => {
        //     return {
        //         ...data,
        //         count: data.price / dataMax
        //     };
        // });
        // console.log(hTestData);
        // console.log(dataMax);
        // this.testData = hTestData;

        this.testData = {
            max: 1,
            min: 0,
            data: [{lat: 50.8408, lng: -0.1728, count: 0.1},
                   {lat: 50.838, lng: -0.1, count: 0.5},
                   {lat: 50.868, lng: -0.08, count: 1},
                   {lat: 50.858, lng: -0.11, count: 0.3}]
        };
    }

    getHouseTypeData(): void {
        const myList = this.allPropertiesInRange.map(data => {
            return {
                id: data.id,
                lat: data.latitude,
                lng: data.longitude,
                price: data.price,
                housetype: data.housetype
            };
        });
        this.houses = layerGroup();
        for (let i = 0; i < myList.length; i++) {
            const markerz = marker([myList[i].lat, myList[i].lng], {
                    icon: icon({
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                        iconUrl: 'assets/icon/' + myList[i].housetype + '.png'
                    })
                }).bindPopup(String(myList[i].price))
            this.houses.addLayer(markerz);
        }
        //const markerList = marker[];
        // for word in list:
        // const list[i][0] = marker([list[i][1], list[i][2]], {
        //     icon: icon({
        //         iconSize: [20, 20],
        //         iconAnchor: [10, 10],
        //         iconUrl: 'assets/icon/' + list[i][3] + '.png'
        //     })
        // }).bindPopup(str(list[i][4]));
        // }
        // this.houses = layerGroup(markerList);
    }

    getHouseTypeTestData(): void {
        const detached = marker([50.8408, -0.1728], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/Detached.png'
            })
        }).bindPopup('This is a Detached House');
        const semidetached    = marker([50.838, -0.1], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/Semi-detached.png'
            })
        }).bindPopup('This is Semi-Detached House');
        const apartment    = marker([50.868, -0.08], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/Flat.png'
            })
        }).bindPopup('This is an Apartment');
        const terrace    = marker([50.858, -0.11], {
            icon: icon({
                iconSize: [ 20, 20 ],
                iconAnchor: [ 10, 10 ],
                iconUrl: 'assets/icon/Terraced.png'
            })
        }).bindPopup('This is a Terraced House');
        this.houses = layerGroup([detached, semidetached, apartment, terrace]);
    }
}
