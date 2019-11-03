import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { DomActionBarComponent } from '~/app/shared/components/dom-action-bar/dom-action-bar.component';

@NgModule({
  declarations: [DomActionBarComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule
  ],
  exports: [
      HttpClientModule,
      NativeScriptRouterModule,
      NativeScriptCommonModule,
      DomActionBarComponent
  ]
})
export class SharedModule { }
