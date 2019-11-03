import { Component, Input, OnInit, Output } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import { LoggingService } from '~/app/services/Log/logging.service';

@Component({
    selector: 'DomActionBar',
    templateUrl: './dom-action-bar.component.html',
    styleUrls: ['./dom-action-bar.component.scss']
})
export class DomActionBarComponent implements OnInit {
    @Input() title: string;
    @Input() showMenu = true;
    @Input() isAppLoading = false;


    constructor(private logger: LoggingService) {
    }

    ngOnInit(): void {
    }

    onDrawerButtonTap(): void {
        this.logger.simpleLog('User Clicked on menu');
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
