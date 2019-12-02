import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    LeafletModule,
    NoopAnimationsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeafletModule,
    MaterialModule,
    ReactiveFormsModule,
    NoopAnimationsModule
  ]
})
export class TestsModule { }
