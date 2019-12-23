import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormSelectControlComponent } from './dynamic-form-select-control.component';

describe('DynamicFormSelectControlComponent', () => {
  let component: DynamicFormSelectControlComponent;
  let fixture: ComponentFixture<DynamicFormSelectControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormSelectControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormSelectControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
