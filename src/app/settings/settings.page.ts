import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsModel } from './settings.model';
import { SettingsService } from '../services/Settings/settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    settings: SettingsModel;
    settingsForm: FormGroup;

    constructor(private userSettings: SettingsService,
                private _fb: FormBuilder,
                private router: Router) {
        this.settings = new SettingsModel();
    }

    ngOnInit(): void {
        console.log(this.userSettings.settings);
        this.settings = this.userSettings.settings;
        this.settingsForm = this._fb.group({
            locInterval: this._fb.control(this.settings.locInterval, [Validators.required, Validators.minLength(1)])
        });
        this.settingsForm.valueChanges.subscribe(() => {
            this.settings.locInterval = this.settingsForm.get('locInterval').value;
        });
    }

    ionViewDidEnter(): void {

    }

    getFormError(formControlName: string): string {
        if (this.settingsForm.get(formControlName)
            .hasError('required')) {
            return 'This field is required';
        }
        if (this.settingsForm.get(formControlName)
            .hasError('minlength')) {
            return 'This form needs at least 1 number';
        }
    }

    async onSaveSettings(): Promise<void> {
        await this.userSettings.saveSettings(this.settings);
        await this.router.navigateByUrl('/home');
    }

    onResetChanges(): void {

    }
}
