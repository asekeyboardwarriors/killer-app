import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular';
import { device } from 'tns-core-modules/platform';
import { DeviceModel } from '~/app/models/Device/device-backend-model';
import { UserModel } from '~/app/models/User/user-backend-model';
import { UserLogin } from '~/app/models/User/user-login';
import { LoggingService } from '~/app/services/Log/logging.service';
import { AuthService } from '~/app/services/User/auth.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';

@Component({
    selector: 'Auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    loginForm: FormGroup;
    userLogin: UserLogin;
    isLoggingIn = false;
    isFormLoading = false;
    hidden = true;

    private _user: UserModel;
    private readonly REGISTER = 'Register';
    private readonly LOG_IN = 'Log in';

    constructor(private fb: FormBuilder,
                private logger: LoggingService,
                private authService: AuthService,
                private userAlerts: UserAlertsService,
                private router: RouterExtensions) {

        this._user = new UserModel(
            device.region,
            '',
            undefined,
            undefined,
            undefined,
            undefined);
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: this.fb.control('', [Validators.required, Validators.email]),
            password: this.fb.control('', [Validators.required, Validators.minLength(6)])
        });
        this.loginForm.valueChanges.subscribe((form: UserLogin) => {
            this.userLogin = form;
            this._user.name = this.userLogin.email;
            this._user.password = this.userLogin.password;
        });
        this._user.device = new DeviceModel(device.uuid, '55', device.os, device.region);
        this._user.location = [];
        this._user.device.countryCode = '55';
    }

    onSubmit(): void {
        this.isFormLoading = true;
        console.log(this.isLoggingIn);
        if (!this.isLoggingIn) {
            this.authService.register(this._user)
                .then((userResponse: any) => {
                        this.logger.multiLog(userResponse);
                        this.isFormLoading = false;
                        this.router.navigate(['/home'], {clearHistory: true});
                    }
                ).catch(e => {
                this.logger.multiLog('An Error has occured while registering the user:', e);
                this.userAlerts.showToUser('Email already in use');
                this.isFormLoading = false;
            });
        } else {
            this.logger.simpleLog('Attempting to log-in user');
            this.authService.login(this._user)
                .then(() => {
                        this.logger.simpleLog('Success Login');
                        this.isFormLoading = false;
                        this.router.navigate(['/home'], {clearHistory: true});
                    }
                ).catch(e => {
                this.logger.multiLog('failed to log-in user', e);
                this.userAlerts.showToUser('Wrong username or password');
                this.isFormLoading = false;
            });
        }
    }

    switchForm(): void {
        this.isLoggingIn = !this.isLoggingIn;
    }

    togglePassword(): void {
        this.hidden = !this.hidden;
    }
}
