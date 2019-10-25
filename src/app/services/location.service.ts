import { Injectable } from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";

@Injectable({
    providedIn: "root"
})
export class LocationService {
    currentLat: number;
    currentLng: number;

    private _location: Location;

    constructor() {
        //
    }

    request() {
        console.log("enableLocationRequest()");
        geolocation.enableLocationRequest().then(() => {
            console.log("location enabled!");
            this.watch();
        }, (e) => {
            console.log("Failed to enable", e);
        });
    }

    watch() {
        console.log("watchLocation()");
        geolocation.watchLocation((position) => {
            this.currentLat = position.latitude;
            this.currentLng = position.longitude;
        }, (e) => {
            console.log("failed to get location");
        }, {
            desiredAccuracy: Accuracy.high,
            minimumUpdateTime: 500
        });
    }

    /**
     * Returns the current location of the user
     * Will check and request permissions if none
     */
    get currentLocation(): Promise<geolocation.Location> {
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest().then(() => {
                return geolocation.getCurrentLocation({desiredAccuracy: Accuracy.high});
            });
        } else {
            return geolocation.getCurrentLocation({desiredAccuracy: Accuracy.high});
        }

    }
}
