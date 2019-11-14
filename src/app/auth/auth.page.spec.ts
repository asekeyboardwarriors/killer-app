import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../shared/material/material.module';

import { AuthPage } from './auth.page';

describe('AuthPage', () => {
    let component: AuthPage;
    let fixture: ComponentFixture<AuthPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuthPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });

});
