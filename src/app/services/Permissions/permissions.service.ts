import { Injectable } from '@angular/core';
import * as permissions from 'nativescript-permissions';
import { isAndroid } from 'platform';
import { LocationService } from '~/app/services/Location/location.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    constructor(private locServices: LocationService) {
    }

    /**
     * Attempts to requests permissions from the user
     */
    requestAllPermissions(): void {
        if (isAndroid) {
            const perms: Array<string> = [
                android.Manifest.permission.READ_EXTERNAL_STORAGE,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                android.Manifest.permission.INTERNET,
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.ACCESS_COARSE_LOCATION,
                android.Manifest.permission.READ_PHONE_STATE,
                android.Manifest.permission.READ_SMS
            ];
            permissions.requestPermissions(perms, 'I need these permissions to work!')
                .then(() => {
                    console.log('Woo Hoo, I have the power!');
                })
                .catch(() => {
                    console.log('Uh oh, no permissions - plan B time!');
                });

        } else {
            this.locServices.requestGeoPermissions();
        }
    }

}
