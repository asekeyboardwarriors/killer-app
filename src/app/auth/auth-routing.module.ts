import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { AuthComponent } from '~/app/auth/auth.component';

const routes: Routes = [
    {path: '', component: AuthComponent}
];

@NgModule({
    declarations: [],
    imports: [
        NativeScriptRouterModule.forChild(routes)
    ],
    exports: [
        NativeScriptRouterModule
    ]
})
export class AuthRoutingModule {
}
