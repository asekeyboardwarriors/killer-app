import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { TextField } from 'ui/text-field';
import { IUserPreferences } from '~/app/models/User/user-settings';
import { UserSettingsService } from '~/app/services/User/user-settings.service';

@Component({
    selector: 'Settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    @ViewChild('frequency', {static: false}) freqText: ElementRef;

    userSettings: IUserPreferences;
    isEditing = false;
    isLoading = false;

    constructor(private userPreferences: UserSettingsService) {
        this.userSettings = {} as IUserPreferences;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.userSettings.locationUpdateFrequency = this.userPreferences.userPreferences.locationUpdateFrequency;
        console.log(this.userPreferences.userPreferences.locationUpdateFrequency);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }

    canEdit(): void {
        this.isEditing = !this.isEditing;
    }

    save(textField: TextField): void {
        this.isLoading = true;
        this.userPreferences.updateUserPreferences({locationUpdateFrequency: Number(textField.text) * 1000}).then(() => {
            this.isLoading = false;
            this.canEdit();
            textField.dismissSoftInput();
        });
    }

    cancel(): void {
        this.canEdit();
        const textField = this.freqText.nativeElement as TextField;
        textField.text = (this.userSettings.locationUpdateFrequency / 1000).toString();
    }
}
