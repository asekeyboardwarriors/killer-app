import { Injectable } from '@angular/core';
import * as permissions from 'nativescript-permissions';
import { isAndroid } from 'platform';
import { Observable } from 'rxjs';
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
    requestAllPermissions(): Promise<void> {
        return new Observable<void>(resolver => {
            if (isAndroid) {
                const perms: Array<string> = [
                    android.Manifest.permission.READ_EXTERNAL_STORAGE,
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    android.Manifest.permission.INTERNET,
                    android.Manifest.permission.ACCESS_FINE_LOCATION,
                    android.Manifest.permission.ACCESS_COARSE_LOCATION,
                ];
                permissions.requestPermissions(perms, 'I need these permissions to work!')
                    .then(() => {
                        console.log('Woo Hoo, I have the power!');
                        resolver.complete();
                    })
                    .catch(() => {
                        console.log('Uh oh, no permissions - plan B time!');
                        resolver.complete();
                    });

            } else {
                this.locServices.requestGeoPermissions();
                resolver.complete();
            }
        }).toPromise();
    }

}
