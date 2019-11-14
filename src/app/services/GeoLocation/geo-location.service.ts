import { Injectable } from '@angular/core';
import { GeolocationPosition, Plugins } from '@capacitor/core';
import { interval, Observable, Subject, Subscriber, Subscription, timer } from 'rxjs';

const {Geolocation} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {
    private _subs: Subscription = new Subscription();

    constructor() {

    }

    /**
     * Emits the current location of the user every set seconds
     * @param perTime How often should the user location be emitted
     */
    getCurrentLocationPerTime(perTime: number): Subject<GeolocationPosition> {
        console.log(`Subscribing to current location every: ${perTime}`);
        const positionSubscriber: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();
        const sourceTimer: Observable<number> = interval(perTime * 1000);
        this._subs = sourceTimer.subscribe(async () => {
            console.log('Sending new location...');
            positionSubscriber.next(await Geolocation.getCurrentPosition());
        });

        return positionSubscriber;
    }

    clearSubscriptions(): void {
        this._subs.unsubscribe();
    }

    /**
     * Gets the user location once can be used to ask permissions aswell
     */
    currentLocation(): Promise<GeolocationPosition> {
        return Geolocation.getCurrentPosition({
            enableHighAccuracy: true
        });
    }
}
