import { TestBed } from '@angular/core/testing';

import { SettingsComponent } from '~/app/settings/settings.component';

describe('UserSettingsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const component: SettingsComponent = TestBed.get(SettingsComponent);
        expect(component).toBeTruthy();
    });

    it('should change the edit value', () => {
        const component: SettingsComponent = TestBed.get(SettingsComponent);
        component.canEdit();
        expect(component.isEditing).toBe(true);
    });
});
