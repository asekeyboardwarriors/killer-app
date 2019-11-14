import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { UserModel } from '../Models/user/user.model';
import { AuthService } from '../services/auth/auth.service';
import { GeoLocationService } from '../services/GeoLocation/geo-location.service';
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

    private _loader: any;

    constructor(private _auth: AuthService,
                private _fb: FormBuilder,
                private _loadingController: LoadingController,
                private _router: Router,
                private _geoLoc: GeoLocationService,
                private _settings: SettingsService
    ) {
        this.titleText = 'Log in';
    }

    ngOnInit(): void {
        this.loginForm = this._fb.group({
            email: this._fb.control('', [Validators.required, Validators.email]),
            password: this._fb.control('', [Validators.required, Validators.minLength(6)])
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
        this._loadingController
            .create({
                message: 'Please wait'
            })
            .then(async loadingEl => {
                await loadingEl.present();
                await this._auth.login(new UserModel('', '', '', [], this.email.value, this.password.value))
                    .then(() => {
                        this._redirectToHome();
                    })
                    .catch(() => console.log('catch error'))
                    .finally(() => {
                        loadingEl.dismiss();
                    });

            });
    }

    onRegister(): void {
        this._loadingController
            .create({
                message: 'Please wait'
            })
            .then(async loadingEl => {
                await loadingEl.present();
                await this._auth.register(new UserModel('', '', '', [], this.email.value, this.password.value))
                    .then(() => this._redirectToHome())
                    .catch(() => console.log('catch error'))
                    .finally(() => {
                        loadingEl.dismiss();
                    });

            });
    }

    async _redirectToHome(): Promise<void> {
        await this._router.navigateByUrl('/home');
    }

    get email(): AbstractControl {
        return this.loginForm.get('email');
    }

    get password(): AbstractControl {
        return this.loginForm.get('password');
    }
}
