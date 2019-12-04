import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeolocationPosition } from '@capacitor/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PropertyModel } from '../Models/properties/property-model';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { PropertiesService } from '../services/properties/properties.service';
import { SettingsService } from '../services/Settings/settings.service';
import { TestsModule } from '../shared/tests/tests.module';
import { HomePage } from './home.page';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let geoLocationSpy: jasmine.SpyObj<GeoLocationService>;
    let settingsSpy: jasmine.SpyObj<SettingsService>;
    let propSpy: jasmine.SpyObj<PropertiesService>;
    let mockPosition: GeolocationPosition;

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

        mockPosition = mockGeoObj;
        geoLocationSpy = jasmine.createSpyObj<GeoLocationService>(['getCurrentLocationPerTime', 'currentLocation']);
        settingsSpy = jasmine.createSpyObj<SettingsService>(['settings']);
        propSpy = jasmine.createSpyObj<PropertiesService>('PropertiesService', ['getPropertiesInRadius']);

        geoLocationSpy.getCurrentLocationPerTime.and.returnValue(of(mockGeoObj) as Subject<GeolocationPosition>);
        geoLocationSpy.currentLocation.and.returnValue(of(mockGeoObj).toPromise());
        propSpy.getPropertiesInRadius.and.returnValue(of([]) as Subject<PropertyModel[]>);

        TestBed.configureTestingModule({
            declarations: [HomePage],
            providers: [
                {provide: GeoLocationService, useValue: geoLocationSpy},
                {provide: SettingsService, useValue: settingsSpy},
                {provide: PropertiesService, useValue: propSpy},
                {
                    provide: LoadingController, useValue: {
                        create: () => Promise.resolve({
                            dismiss: () => {
                            },
                            present: () => {
                            }
                        }),
                        dismiss: () => Promise.resolve()
                    }
                }
            ],
            imports: [
                IonicModule.forRoot(),
                TestsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();

        geoLocationSpy = TestBed.get(GeoLocationService);
        settingsSpy = TestBed.get(SettingsService);
        spyOn(component, 'onMapReady').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update map center with new geolocation', () => {
        component.ionViewWillEnter();
        expect(component.map.getCenter().lng).toBe(mockPosition.coords.longitude);
        expect(component.map.getCenter().lat).toBe(mockPosition.coords.latitude);
    });

    it('should have a map ready after a component has fully initialized ( no more than 5s )', async (() => {
        component.ionViewWillEnter();
        of(true).pipe(delay(5000)).subscribe(() => {
           expect(component.onMapReady).toHaveBeenCalled();
        });
    }));
});
