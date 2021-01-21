/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VirtualTrucksComponent } from './virtual-trucks.component';

describe('VirtualTrucksComponent', () => {
  let component: VirtualTrucksComponent;
  let fixture: ComponentFixture<VirtualTrucksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualTrucksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualTrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
