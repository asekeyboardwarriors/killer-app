import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../services/Settings/settings.service';
import { TestsModule } from '../shared/tests/tests.module';
import { SettingsModel } from './settings.model';

import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
    let component: SettingsPage;
    let fixture: ComponentFixture<SettingsPage>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async(() => {
        routerSpy = jasmine.createSpyObj<Router>(['navigateByUrl']);
        routerSpy.navigateByUrl.and.callThrough();

        TestBed.configureTestingModule({
            declarations: [SettingsPage],
            providers: [
                FormBuilder,
                {
                    provide: SettingsService, useValue: {
                        settings: (): SettingsModel => ({
                            locInterval: 60,
                            distance: 1,
                            gradientBool: false,
                            localExtrema: true
                        }),
                        saveSettings: () => Promise.resolve()
                    }
                },
                {
                    provide: Router, useValue: routerSpy
                }

            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                TestsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  /*  it('should be able to display different time intervals', () => {

    });*/
});
