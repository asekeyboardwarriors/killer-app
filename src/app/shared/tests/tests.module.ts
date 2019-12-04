import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
        NoopAnimationsModule,
        HttpClientModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LeafletModule,
        MaterialModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientModule
    ]
})
export class TestsModule {
}
