import { TestBed } from '@angular/core/testing';

import { SettingsComponent } from '../settings/settings.component.js';

describe('UserSettingsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        console.log('Test 1');
        const component: SettingsComponent = TestBed.get(SettingsComponent);
        expect(component).toBeTruthy();
    });

    it('should change the edit value', () => {
        const component: SettingsComponent = TestBed.get(SettingsComponent);
        console.log('Test 2');
        component.canEdit();
        expect(component.isEditing).toBe(true);
    });
});
