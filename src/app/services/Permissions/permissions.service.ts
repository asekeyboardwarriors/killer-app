import { Injectable } from '@angular/core';
import * as permissions from 'nativescript-permissions';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    private _allNeededPermissions: Array<string> = [
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        android.Manifest.permission.INTERNET,
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION,
        android.Manifest.permission.READ_PHONE_STATE,
        android.Manifest.permission.READ_SMS
    ];

    /**
     * Attempts to requests permissions from the user
     */
    requestAllPermissions(): void {
        permissions.requestPermissions(this._allNeededPermissions, 'I need these permissions to work!')
            .then(() => {
                console.log('Woo Hoo, I have the power!');
            })
            .catch(() => {
                console.log('Uh oh, no permissions - plan B time!');
            });

    }

}
