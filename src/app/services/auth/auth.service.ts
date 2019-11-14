import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserModel } from '../../Models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _currentUser: UserModel;
    private readonly URI = 'https://ariasep.herokuapp.com';
    private readonly USER = '/user';
    private readonly CREATE = '/create';
    private readonly AUTHENTICATE = '/getByEmail';

    constructor(private _http: HttpClient,
                private _toastController: ToastController) {
        this._currentUser = new UserModel();
    }

    /**
     * Fires a request to the server to check if user exists and if exists login
     * @param user The user to check
     */
    async login(user: UserModel): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._http.post<UserModel>(this.URI + this.AUTHENTICATE, JSON.stringify({
                name: user.name,
                password: user.password
            })).subscribe(async (callbackUser: UserModel) => {
                console.log(callbackUser);
                this._currentUser = callbackUser;
                const toast = await this._toastController.create({
                    message: 'Logged in successfully!',
                    duration: 2500,
                    color: 'primary'
                });
                await toast.present();
                resolve();
            }, async (error: HttpErrorResponse) => {
                const toast = await this._toastController.create({
                    message: error.message,
                    duration: 2500,
                    color: 'primary'
                });
                await toast.present();
                console.log(error);
                reject();
            });
        });
    }

    async register(user: UserModel): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._http.post<UserModel>(this.URI + this.CREATE, user)
                .subscribe(async (callbackUser: UserModel) => {
                    this._currentUser = callbackUser;
                    const toast = await this._toastController.create({
                        message: 'Registered successfully!',
                        duration: 2500,
                        color: 'primary'
                    });
                    await toast.present();
                    resolve();
                }, async (error: HttpErrorResponse) => {
                    console.log(error);
                    const toast = await this._toastController.create({
                        message: error.message,
                        duration: 2500,
                        color: 'primary'
                    });
                    await toast.present();
                    reject();
                });
        });

    }

    get user() {
        return this._currentUser;
    }
}
