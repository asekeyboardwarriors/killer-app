import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { UserModel } from '~/app/models/User/user-backend-model';
import { UserLogin } from '~/app/models/User/user-login';
import { LoggingService } from '~/app/services/Log/logging.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isAuthenticated = false;
    private readonly URI = 'https://ariasep.herokuapp.com/';
    private readonly USER = '/user';
    private _user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({} as UserModel);

    constructor(private logger: LoggingService,
                private userAlters: UserAlertsService,
                private http: HttpClient) {
    }

    /**
     * Registers the user in to the backend
     * @param user The user information
     */
    register(user: UserModel): Promise<string> {
        this.logger.multiLog('Registering user', user);

        return this.http.post<string>(this.URI + this.USER, user, {
            // @ts-ignore
            responseType: 'text',
            headers: {
                'content-type': 'application/json'
            }
        }).pipe(tap((email: string) => {
            this._user.next(user);
            this._isAuthenticated = true;
        })).toPromise();
    }

    /**
     * Fires a request to the server to check if user exists and if exists login
     * @param user The user to check
     */
    login(user: UserModel): Promise<string> {
        this.logger.multiLog(user);

        return this.http.post<string>(this.URI + this.USER, user, {
            // @ts-ignore
            responseType: 'text',
            headers: {
                'content-type': 'application/json'
            }
        }).pipe(tap((email: string) => {
            this._user.next(user);
            this._isAuthenticated = true;
        })).toPromise();

    }

    get user(): BehaviorSubject<UserModel> {
        return this._user;
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

}
