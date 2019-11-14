import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../shared/material/material.module';

import { AuthPage } from './auth.page';

const routes: Routes = [
    {
        path: '',
        component: AuthPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [AuthPage]
})
export class AuthPageModule {
}
