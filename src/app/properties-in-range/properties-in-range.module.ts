import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PropertiesInRangePage } from './properties-in-range.page';

const routes: Routes = [
  {
    path: '',
    component: PropertiesInRangePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTableModule,
    FlexModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  declarations: [PropertiesInRangePage]
})
export class PropertiesInRangePageModule {}
