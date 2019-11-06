import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { DomActionBarComponent } from '~/app/shared/components/dom-action-bar/dom-action-bar.component';
import { BlockComponent } from './components/block/block.component';

@NgModule({
    declarations: [DomActionBarComponent, BlockComponent],
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        CommonModule
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        NativeScriptRouterModule,
        NativeScriptCommonModule,
        DomActionBarComponent,
        BlockComponent
    ]
})
export class SharedModule {
}
