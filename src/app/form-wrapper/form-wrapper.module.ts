import { NgModule } from "@angular/core";
import { FormWrapperComponent } from './form-wrapper.component';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [FormWrapperComponent],
  imports: [
    DynamicFormModule,
    MatCardModule
  ],
  exports: [FormWrapperComponent]
})

export class FormWrapperModule { }
