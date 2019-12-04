import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { delay, first, take } from 'rxjs/operators';
import { UserModel } from '../Models/user/user.model';
import { AuthService } from '../services/auth/auth.service';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
import { PropertiesService } from '../services/properties/properties.service';
import { SettingsService } from '../services/Settings/settings.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
    titleText: string;
    hide = true;
    loginForm: FormGroup;

    private _loadingEl: HTMLIonLoadingElement;

    constructor(private _auth: AuthService,
                private _loadingController: LoadingController,
                private _router: Router,
                private _geoLoc: GeoLocationService,
                private _settings: SettingsService
    ) {
        this.titleText = 'Log in';
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)])
        });
    }

    ionViewWillEnter(): void {
        this._geoLoc.currentLocation().then(loc => {
            delay(200);
            console.log('Location perms granted!');
            this._settings.askPermissionsAndCreateDefault();
        }).catch(() => {
            console.log('Location perms denied!');
            this._settings.askPermissionsAndCreateDefault();
        });
    }

    onLogin(): void {
        console.log('logging...');
        this.showLoading();
        this._auth.login(new UserModel('', '', '', [], this.email.value, this.password.value))
            .then(() => {
                console.log('done');
                this.redirectToHome();
            })
            .catch(() => console.log('catch error'))
            .finally(async () => {
                await this.dismissLoading();
            });
    }

    onRegister(): void {
        this.showLoading();
        this._auth.register(new UserModel('', '', '', [], this.email.value, this.password.value))
            .then(() => this.redirectToHome())
            .catch(() => console.log('catch error'))
            .finally(async () => {
                await this.dismissLoading();
            });
    }

    redirectToHome(): void {
        this._router.navigateByUrl('/home');
    }

    async dismissLoading(): Promise<void> {
        await this._loadingEl.dismiss();
    }

    showLoading(): void {
        this._loadingController.create({
            message: 'Please Wait'
        }).then(overlay => {
            this._loadingEl = overlay;
            this._loadingEl.present();
        });
    }

    get email(): AbstractControl {
        return this.loginForm.get('email');
    }

    get password(): AbstractControl {
        return this.loginForm.get('password');
    }
}
