import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular';
import { Telephony } from 'nativescript-telephony';
import { UserLogin } from '~/app/models/User/user-login';
import { AuthService } from '~/app/services/User/auth.service';
import { LoggingService } from '~/app/services/Log/logging.service';
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

    private readonly REGISTER = 'Register';
    private readonly LOG_IN = 'Log in';

    constructor(private fb: FormBuilder,
                private logger: LoggingService,
                private authService: AuthService,
                private userAlerts: UserAlertsService,
                private router: RouterExtensions) {
        this.userLogin = new UserLogin();
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: this.fb.control('', [Validators.required, Validators.email]),
            password: this.fb.control('', [Validators.required, Validators.minLength(6)])
        });
        this.loginForm.valueChanges.subscribe((form: UserLogin) => {
            this.userLogin = form;
        });
        Telephony().then(resolved => {
            console.log('resolved >', resolved);
            console.dir(resolved);
        }).catch(error => {
            console.error('error >', error);
            console.dir(error);
        });

    }

    onSubmit(): void {
        this.isFormLoading = true;
        if (!this.isLoggingIn) {
            this.authService.register(this.userLogin)
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
            this.authService.login(this.userLogin)
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
