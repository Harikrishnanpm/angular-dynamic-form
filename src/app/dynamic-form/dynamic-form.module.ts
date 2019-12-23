import { NgModule } from '@angular/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DynamicFormComponent } from './dynamic-form.component';
import {
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { DynamicFormSelectControlComponent } from './dynamic-form-select-control/dynamic-form-select-control.component';

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
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ],
  entryComponents: [DynamicFormSelectControlComponent]
})
export class DynamicFormModule { }
