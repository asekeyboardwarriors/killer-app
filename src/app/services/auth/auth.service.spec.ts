import { HttpClient } from '@angular/common/http';
import { async, fakeAsync, tick } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { defer, of } from 'rxjs';

import { AuthService } from './auth.service';

/**
 *  Create async observable that emits-once and completes
 *  after a JS engine turn
 */
// tslint:disable-next-line:typedef only-arrow-functions
export function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

describe('AuthService', () => {
    let httpClientSpy: { post: jasmine.Spy };
    let authService: AuthService;
    let originalTimeout: number;

    beforeEach(async(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        authService = new AuthService(httpClientSpy as any, new ToastController());
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }));

    it('Should login a user and store the user as current user', fakeAsync(() => {
        const user = {
            id: '',
            country: '',
            city: '',
            location: [],
            name: 'a@a.com',
            password: 'password',
            device: undefined
        };
        httpClientSpy.post.and.returnValue(asyncData(user));
        of(authService.login(user)).subscribe(() => {
        });
        tick();
        expect(authService.user.name).toEqual(user.name);

    }));

    it('should register a user and store the user as current user', fakeAsync(() => {
        const user = {
            id: '',
            country: '',
            city: '',
            location: [],
            name: 'a@a.com',
            password: 'password',
            device: undefined
        };
        httpClientSpy.post.and.returnValue(asyncData(user));
        of(authService.register(user)).subscribe(() => {
        });
        tick();
        expect(authService.user.name).toEqual(user.name);
    }));

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
