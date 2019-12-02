import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { GeolocationPosition } from '@capacitor/core';
import { interval, of, timer } from 'rxjs';
import { GeoLocationService } from './geo-location.service';

describe('GeoLocationService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            GeoLocationService
        ]
    }));

    it('should be created', () => {
        const service: GeoLocationService = TestBed.get(GeoLocationService);
        expect(service).toBeTruthy();
    });
});
