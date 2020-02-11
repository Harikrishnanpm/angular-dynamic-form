import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxMaskModule } from 'ngx-mask';

import { DynamicFormComponent } from './dynamic-form.component';
import { ErrorMessageComponent } from './error-message/error-message.component';

@NgModule({
  declarations: [
    DynamicFormComponent,
    ErrorMessageComponent
  ],
  exports: [DynamicFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class DynamicFormModule { }
