import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { RadiusModel } from '../../Models/geolocation/radius.model';
import { PropertyModel } from '../../Models/properties/property-model';
import { SettingsService } from '../Settings/settings.service';

@Injectable({
    providedIn: 'root'
})
export class PropertiesService {
    private readonly URI = 'https://ariasep.herokuapp.com/property';
    private readonly RADIUS = '/radius';
    private readonly TEST = '/test/100';

    private _propertiesSubject: Subject<PropertyModel[]> = new Subject<PropertyModel[]>();

    constructor(private _http: HttpClient,
                private _toastController: ToastController,
                private _settings: SettingsService) {
    }

    /**
     * Gets all properties in the passed radius
     */
    getPropertiesInRadius(rad: RadiusModel): Subject<PropertyModel[]> {
        this._http.post<PropertyModel[]>(this.URI + this.RADIUS, JSON.stringify(rad), {
            headers:  {
                'Content-Type': 'application/json'
            }
        })
            .subscribe((properties: PropertyModel[]) => {
                console.log(properties);
                console.log('done!!!!');
                this._propertiesSubject.next(properties);
            }, async error => {
                const toast = await this._toastController.create({
                    message: error.message,
                    duration: 2500,
                    color: 'primary'
                });
                await toast.present();
            });

        return this._propertiesSubject;
    }

    /**
     * @deprecated
     * Returns random 100 properties
     * Handles errors by presenting a toast
     */
    getRandomProperties(): Subject<PropertyModel[]> {
        this._http.get<PropertyModel[]>(this.URI + this.TEST).subscribe((properties: PropertyModel[]) => {
            this._propertiesSubject.next(properties);
        }, async error => {
            const toast = await this._toastController.create({
                message: error.message,
                duration: 2500,
                color: 'primary'
            });
            await toast.present();
            console.log(error);
        });

        return this._propertiesSubject;
    }
}
