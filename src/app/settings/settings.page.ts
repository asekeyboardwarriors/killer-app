import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../services/Settings/settings.service';
import { SettingsModel } from './settings.model';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
    settings: SettingsModel;
    settingsForm: FormGroup;
    colourToggle: boolean;
    extremaToggle: boolean;

    constructor(private userSettings: SettingsService,
                private _fb: FormBuilder,
                private router: Router) {
        this.settings = new SettingsModel();
        this.colourToggle = this.settings.gradientBool;
        this.extremaToggle = this.settings.localExtrema;
    }

    ngOnInit(): void {
        // console.log(this.userSettings.settings);
        this.settings = this.userSettings.settings;
        this.settingsForm = this._fb.group({
            locInterval: this._fb.control(this.settings.locInterval, [Validators.required,
                                                                      Validators.min(1)]),
            distance: this._fb.control(this.settings.distance, [Validators.required,
                                                                Validators.min(1), Validators.max(100)])
        });
        this.settingsForm.valueChanges.subscribe(() => {
            this.settings.locInterval = this.settingsForm.get('locInterval').value;
            this.settings.distance = this.settingsForm.get('distance').value;
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
        if (this.settingsForm.get(formControlName)
            .hasError('max')) {
            return `The maximum amount is ${this.settingsForm.get(formControlName).getError('max').max}`;
        }
    }

    async onSaveSettings(): Promise<void> {
        await this.toggleSave();
        console.log('in onSaveSettings', this.settings);
        await this.userSettings.saveSettings(this.settings);
        await this.router.navigateByUrl('/home');
    }

    onResetChanges(): void {

    }

    toggleSave(): void {
        console.log('in on toggle save');
        if (this.extremaToggle !== this.settings.localExtrema) {
            this.settings.localExtrema = this.extremaToggle;
        }
        if (this.colourToggle !== this.settings.gradientBool) {
            this.settings.gradientBool = this.colourToggle;
        }
    }

    extremaChange(event: CustomEvent): void {
        console.log(event);
        this.extremaToggle = event.detail.checked;
    }

    colourChange(event): void {
        this.colourToggle = event.detail.checked;
    }

}
