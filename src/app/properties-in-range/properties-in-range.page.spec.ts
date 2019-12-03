import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesInRangePage } from './properties-in-range.page';

describe('PropertiesInRangePage', () => {
  let component: PropertiesInRangePage;
  let fixture: ComponentFixture<PropertiesInRangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesInRangePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesInRangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
