import { BrowserModule } from '@angular/platform-browser';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormSelectControlComponent } from './dynamic-form-select-control/dynamic-form-select-control.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatCheckboxModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DynamicFormComponent,
    ErrorMessageComponent,
    DynamicFormSelectControlComponent
  ],
  exports: [DynamicFormComponent, DynamicFormSelectControlComponent],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  entryComponents: [DynamicFormSelectControlComponent]
})
export class DynamicFormModule { }
