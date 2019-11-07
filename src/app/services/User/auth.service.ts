import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { UserModel } from '~/app/models/User/user-backend-model';
import { LoggingService } from '~/app/services/Log/logging.service';
import { UserAlertsService } from '~/app/services/User/user-alerts.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _cachedUser: UserModel;
    private _isAuthenticated = false;
    private readonly URI = 'https://ariasep.herokuapp.com';
    private readonly USER = '/user';
    private readonly CREATE = '/create';
    private readonly AUTHENTICATE = '/getByEmail';
    private _user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({} as UserModel);

    constructor(private logger: LoggingService,
                private userAlters: UserAlertsService,
                private http: HttpClient) {
    }

    /**
     * Registers the user in to the backend
     * @param user The user information
     */
    register(user: UserModel): Promise<UserModel> {
        this.logger.multiLog('Registering user', user);

        return this.http.post<UserModel>(this.URI + this.CREATE, user, {
            headers: {
                'content-type': 'application/json'
            }
        }).pipe(tap((userRequest: UserModel) => {
            this.logger.multiLog('After registering user', userRequest);
            this._user.next(userRequest);
            this._cachedUser = userRequest;
            this._isAuthenticated = true;
        })).toPromise();
    }

    /**
     * Fires a request to the server to check if user exists and if exists login
     * @param user The user to check
     */
    login(user: UserModel): Promise<UserModel> {
        this.logger.multiLog(user);

        return this.http.post<UserModel>(this.URI + this.AUTHENTICATE, user)
            .pipe(tap((userRequest: UserModel) => {
                this._user.next(userRequest);
                this._isAuthenticated = true;
                this._cachedUser = userRequest;
            })).toPromise();

    }

    get user(): BehaviorSubject<UserModel> {
        return this._user;
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    get cachedUser(): UserModel {
        return this._cachedUser;
    }

}
