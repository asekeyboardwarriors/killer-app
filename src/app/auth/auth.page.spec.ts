import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { GeolocationPosition } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { of } from 'rxjs';
import 'zone.js/dist/zone-testing';
import { AuthService } from '../services/auth/auth.service';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { SettingsService } from '../services/Settings/settings.service';
import { TestsModule } from '../shared/tests/tests.module';
import { AuthPage } from './auth.page';

describe('AuthPage', () => {
    let component: AuthPage;
    let fixture: ComponentFixture<AuthPage>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routeServiceSpy: jasmine.SpyObj<Router>;
    let geoServiceSpy: jasmine.SpyObj<GeoLocationService>;
    let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
    let loadingController: jasmine.SpyObj<LoadingController>;

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

        const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'register']);
        const routeSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
        const geoSpy = jasmine.createSpyObj<GeoLocationService>('GeoLocationService', ['currentLocation']);
        const settingsSpy = jasmine.createSpyObj<SettingsService>('SettingsService', ['askPermissionsAndCreateDefault']);

        geoSpy.currentLocation.and.returnValue(of(mockGeoObj).toPromise());
        settingsSpy.askPermissionsAndCreateDefault.and.callThrough();
        authSpy.login.and.returnValue(new Promise(resolve => resolve()));
        authSpy.register.and.returnValue(new Promise(resolve => resolve()));

        TestBed.configureTestingModule({

            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: AuthService, useValue: authSpy},
                {provide: Router, useValue: routeSpy},
                {provide: GeoLocationService, useValue: geoSpy},
                {provide: SettingsService, useValue: settingsSpy},
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
                TestsModule,
                BrowserAnimationsModule
            ],
            declarations: [
                AuthPage
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        authServiceSpy = TestBed.get(AuthService);
        routeServiceSpy = TestBed.get(Router);
        geoServiceSpy = TestBed.get(GeoLocationService);
        settingsServiceSpy = TestBed.get(SettingsService);
        loadingController = TestBed.get(LoadingController);
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });

    it('should create the form on initialization', () => {
        expect(component.loginForm).toBeTruthy('Form was not initialized');
        component.ngOnInit();
        expect(component.loginForm.get('password').value).toBeFalsy('There should be no initial input in password');
    });

    it('Expect to redirect after clicking login', async(() => {
        spyOn(component, 'redirectToHome');
        component.ngOnInit();
        fixture.detectChanges();
        component.onLogin();
        fixture.whenStable().then(() => {
            expect(component.redirectToHome).toHaveBeenCalled();
        });
    }));

    it('Expect to redirect after clicking register', async(() => {
        spyOn(component, 'redirectToHome');
        component.ngOnInit();
        fixture.detectChanges();
        component.onRegister();
        fixture.whenStable().then(() => {
            expect(component.redirectToHome).toHaveBeenCalled();
        });
    }));

    it('should reveal password if user hits visibility on then off when user hits off', async(() => {
        fixture.autoDetectChanges();
        fixture.detectChanges();
        component.ngOnInit();
        component.ionViewWillEnter();
        component.hide = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            debugger;
            const authCompDe: DebugElement = fixture.debugElement;
            const passwordInputEl = authCompDe.queryAll(By.css('input'));
            const passwordInput: HTMLInputElement = passwordInputEl[1].nativeElement;
            expect(passwordInput.type).toBe('text');
            component.hide = true;
            fixture.detectChanges();
            expect(passwordInput.type).toBe('password');
        });
    }));

});
