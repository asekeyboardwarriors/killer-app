import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeolocationPosition } from '@capacitor/core';
import { IonicModule } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { SettingsService } from '../services/Settings/settings.service';
import { TestsModule } from '../shared/tests/tests.module';

import { HomePage } from './home.page';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let geoLocationSpy: jasmine.SpyObj<GeoLocationService>;
    let settingsSpy: jasmine.SpyObj<SettingsService>;

    beforeEach(async(() => {
        const mockGeoObj: GeolocationPosition = {
            coords: {
                latitude: 50,
                longitude: 5,
                altitude: 4,
                accuracy: 1
            },
            timestamp: Date.now()
        };

        geoLocationSpy = jasmine.createSpyObj<GeoLocationService>(['getCurrentLocationPerTime', 'currentLocation']);
        settingsSpy = jasmine.createSpyObj<SettingsService>(['settings']);

        geoLocationSpy.getCurrentLocationPerTime.and.returnValue(of(mockGeoObj) as Subject<GeolocationPosition>);
        geoLocationSpy.currentLocation.and.returnValue(of(mockGeoObj).toPromise());
        TestBed.configureTestingModule({
            declarations: [HomePage],
            providers: [
              {provide: GeoLocationService, useValue: geoLocationSpy},
              {provide: SettingsService, useValue: settingsSpy},
            ],
            imports: [
                IonicModule.forRoot(),
                TestsModule,
                BrowserAnimationsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      geoLocationSpy = TestBed.get(GeoLocationService);
      settingsSpy = TestBed.get(SettingsService);
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
