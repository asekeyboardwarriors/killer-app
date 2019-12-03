import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { PropertyModel } from '../../Models/properties/property-model';

@Injectable({
    providedIn: 'root'
})
export class PropertiesService {
    private readonly URI = 'https://ariasep.herokuapp.com/property/test/100';
    private _propertiesSubject: Subject<PropertyModel[]> = new Subject<PropertyModel[]>();

    constructor(private _http: HttpClient,
                private _toastController: ToastController) {
    }

    /**
     * Returns random 100 properties
     * Handles errors by presenting a toast
     */
    getRandomProperties(): Subject<PropertyModel[]> {
        this._http.get<PropertyModel[]>(this.URI).subscribe((properties: PropertyModel[]) => {
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
