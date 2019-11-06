import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedInit, nsTestBedRender } from 'nativescript-angular/testing';
import 'reflect-metadata';
import { SettingsComponent } from '~/app/settings/settings.component';

describe('SettingsComponent', () => {
    beforeAll(nsTestBedInit);
    afterAll(() => {
        //
    });
    beforeEach(nsTestBedBeforeEach([SettingsComponent]));
    afterEach(nsTestBedAfterEach());
    it('should be: app works!', () =>
        nsTestBedRender(SettingsComponent).then(fixture => {
            fixture.detectChanges();
            const settingsComponent = fixture.componentInstance;
            expect(settingsComponent).toBeTruthy('Failed!');
        }));
});
