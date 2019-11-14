import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AuthPage} from './auth.page';
import {MaterialModule} from '../shared/material/material.module';

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
