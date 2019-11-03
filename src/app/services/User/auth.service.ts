import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { UserLogin } from '~/app/models/User/user-login';
import { LoggingService } from '~/app/services/Log/logging.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _isAuthenticated = false;
    private readonly URI = 'https://dom-killer-api20191031055305.azurewebsites.net/api/v1';
    private readonly USERS = '/users';
    private readonly USER = '/user';
    private _user: BehaviorSubject<UserLogin> = new BehaviorSubject<UserLogin>(new UserLogin());

    constructor(private logger: LoggingService,
                private userAlters: UserAlertsService,
                private http: HttpClient) {
    }

    /**
     * Registers the user in to the backend
     * @param user The user information
     */
    register(user: UserLogin): Promise<string> {
        this.logger.multiLog('Registering user', user);

        return this.http.post<string>(this.URI + this.USERS + this.USER, user, {
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
    login(user: UserLogin): Promise<string> {
        this.logger.multiLog(user);

        return this.http.post<string>(this.URI + this.USERS + this.USER, user, {
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

    get user(): BehaviorSubject<UserLogin> {
        return this._user;
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

}
