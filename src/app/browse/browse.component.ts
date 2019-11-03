import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { LocationService } from '~/app/services/Location/location.service';
import { LoggingService } from '~/app/services/Log/logging.service';

@Component({
    selector: 'Browse',
    templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {

    constructor(private locationService: LocationService,
                private logger: LoggingService) {

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
