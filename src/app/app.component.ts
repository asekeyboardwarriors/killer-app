import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as app from 'tns-core-modules/application';
import { UserLogin } from '~/app/models/User/user-login';
import { AuthService } from '~/app/services/User/auth.service';
import { LocationService } from '~/app/services/Location/location.service';
import { LoggingService } from '~/app/services/Log/logging.service';
import { PermissionsService } from '~/app/services/Permissions/permissions.service';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    user: Subject<UserLogin>;

    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(private router: Router,
                private routerExtensions: RouterExtensions,
                private locationService: LocationService,
                private loggerService: LoggingService,
                private permissionService: PermissionsService,
                private auth: AuthService) {

        loggerService.environment = 'dev';
        this.user = this.auth.user;
    }

    ngOnInit(): void {
        this._activatedUrl = '/home';
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
        this.permissionService.requestAllPermissions().then(() => {
            this.locationService.subscribeToLocation();
        });
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: 'fade'
            }
        });

        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.closeDrawer();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
}
