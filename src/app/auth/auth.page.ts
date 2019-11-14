import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {UserModel} from '../Models/user/user.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    titleText: string;
    hide = true;
    loginForm: FormGroup;

    private _loader: any;

    constructor(private _auth: AuthService,
                private _fb: FormBuilder,
                private _loadingController: LoadingController,
                private _router: Router
    ) {
        this.titleText = 'Log in';
    }

    async ngOnInit() {
        this.loginForm = this._fb.group({
            email: this._fb.control('', [Validators.required, Validators.email]),
            password: this._fb.control('', [Validators.required, Validators.minLength(6)])
        });
    }

    async onLogin() {
        this._loadingController.create({
            message: 'Please wait'
        }).then(async loadingEl => {
            await loadingEl.present();
            await this._auth.login(new UserModel('', '', '', [], this.email.value, this.password.value))
                .then(() => {
                    this._router.navigateByUrl('/home');
                })
                .catch(() => console.log('catch error'))
                .finally(() => {
                    loadingEl.dismiss();
                });

        });
    }

    onRegister() {
        this._loadingController.create({
            message: 'Please wait'
        }).then(async loadingEl => {
            await loadingEl.present();
            await this._auth.register(new UserModel('', '', '', [], this.email.value, this.password.value))
                .then(() => console.log('success'))
                .catch(() => console.log('catch error'))
                .finally(() => {
                    loadingEl.dismiss();
                });

        });
    }

    get email(): AbstractControl {
        return this.loginForm.get('email');
    }

    get password(): AbstractControl {
        return this.loginForm.get('password');
    }
}
