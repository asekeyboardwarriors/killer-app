import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PropertyModel } from '../Models/properties/property-model';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { PropertiesService } from '../services/properties/properties.service';
import { SettingsService } from '../services/Settings/settings.service';

@Component({
    selector: 'properties-in-range',
    templateUrl: 'properties-in-range.page.html',
    styleUrls: ['properties-in-range.page.scss']
})
export class PropertiesInRangePage {

    displayedColumns: Array<string> = ['price', 'date', 'housetype', 'duration', 'address'];
    allPropertiesInRange: PropertyModel[];

    private _sub: Subscription = new Subscription();
    private _loadingIndicator: HTMLIonLoadingElement;

    constructor(private _propertiesService: PropertiesService,
                private _geo: GeoLocationService,
                private _settings: SettingsService,
                private _loader: LoadingController) {
    }

    ionViewWillEnter(): void {
        this._loader.create({
            message: 'Please wait!'
        }).then(async overlay => {
            this._loadingIndicator = overlay;
            await overlay.present();
        });
        this._geo.currentLocation().then(geoPos => {
            this._propertiesService.getPropertiesInRadius({
                latitude: geoPos.coords.latitude,
                longitude: geoPos.coords.longitude,
                radius: this._settings.settings.distance
            })
                .subscribe(async (propertiesInRange: PropertyModel[]) => {
                    this.allPropertiesInRange = propertiesInRange;
                    await this._loadingIndicator.dismiss();
                }, async error => {
                    await this._loadingIndicator.dismiss();
                });
        });
    }

    ionViewWillLeave(): void {
        this._sub.unsubscribe();
    }
}
