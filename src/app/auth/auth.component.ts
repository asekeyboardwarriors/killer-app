import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular';
import { DeviceModel } from '~/app/models/Device/device-backend-model';
import { UserModel } from '~/app/models/User/user-backend-model';
import { UserLogin } from '~/app/models/User/user-login';
import { LoggingService } from '~/app/services/Log/logging.service';
import { AuthService } from '~/app/services/User/auth.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';
import { device } from 'tns-core-modules/platform';

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

        this._user = new UserModel(device.region, '', undefined, undefined, undefined);
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: this.fb.control('', [Validators.required, Validators.email]),
            password: this.fb.control('', [Validators.required, Validators.minLength(6)])
        });
        this.loginForm.valueChanges.subscribe((form: UserLogin) => {
            this.userLogin = form;
        });

    }

    onSubmit(): void {
        this.isFormLoading = true;
        this._user.device = new DeviceModel(device.uuid, '', device.deviceType, device.region);
        this._user.location = [];
        if (!this.isLoggingIn) {
            this.authService.register(this._user)
                .then((userResponse: any) => {
                        this.logger.multiLog(userResponse);
                        this.isFormLoading = false;
                        this.router.navigate(['/home'], {clearHistory: true});
                    }
                ).catch(e => {
                this.logger.multiLog('An Error has occured while registering the user:', e);
                this.isFormLoading = false;
            });
        } else {
            this.authService.login(this._user)
                .then(() => {
                        this.isFormLoading = false;
                        this.router.navigate(['/home'], {clearHistory: true});
                    }
                );
        }
    }

    switchForm(): void {
        this.isLoggingIn = !this.isLoggingIn;
    }

    togglePassword(): void {
        this.hidden = !this.hidden;
    }
}
