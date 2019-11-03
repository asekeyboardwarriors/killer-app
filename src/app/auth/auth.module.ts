import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from 'nativescript-angular';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { AuthRoutingModule } from '~/app/auth/auth-routing.module';
import { SharedModule } from '~/app/shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class AuthModule {
}
