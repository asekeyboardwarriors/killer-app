import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { AuthRoutingModule } from '~/app/auth/auth-routing.module';
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        NativeScriptCommonModule,
        AuthRoutingModule
    ]
})
export class AuthModule {
}
