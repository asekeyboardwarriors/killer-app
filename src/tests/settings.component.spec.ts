import { ComponentFixture, TestBed } from '@angular/core/testing';
import { nsTestBedBeforeEach, nsTestBedInit, nsTestBedRender } from 'nativescript-angular/testing';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';
import { UserSettingsService } from '~/app/services/User/user-settings.service';

import { SettingsComponent } from '~/app/settings/settings.component';
import { SharedModule } from '~/app/shared/shared.module';
import "reflect-metadata";

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;
    let userPrefService: UserSettingsService;
    let userAlertService: UserAlertsService;

    beforeAll(() => {
        nsTestBedInit();
    });
    beforeEach(() => {
        nsTestBedBeforeEach([SettingsComponent]);
        TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            providers: [
                UserSettingsService,
                UserAlertsService,
                SharedModule,

            ]
        });
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        userPrefService = TestBed.get(UserSettingsService);
        userAlertService = TestBed.get(UserAlertsService);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});
