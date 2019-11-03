import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { TextField } from 'ui/text-field';
import { IUserPreferences } from '~/app/models/User/user-settings';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';
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
    private readonly IOS_KEYBOARDTYPE_NUMBERPAD: number = 4;

    constructor(private userPreferences: UserSettingsService,
                private userAlerts: UserAlertsService) {
        this.userSettings = {} as IUserPreferences;
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.userSettings = this.userPreferences.userPreferences;

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
        if (Number.isNaN(Number(textField.text))) {
            this.userAlerts.showToUser('Invalid Number');
            this.cancel();
        } else {
            this.userPreferences.updateUserPreferences({locationUpdateFrequency: Number(textField.text) * 1000}).then(() => {
                this.isLoading = false;
                this.userSettings.locationUpdateFrequency = Number(textField.text) * 1000;
                this.cancel();
                textField.dismissSoftInput();
            });
        }
    }

    cancel(): void {
        this.canEdit();
        const textField = this.freqText.nativeElement as TextField;
        textField.text = (this.userSettings.locationUpdateFrequency / 1000).toString();
    }
}
