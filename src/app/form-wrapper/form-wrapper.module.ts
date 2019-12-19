import { NgModule } from "@angular/core";
import { FormWrapperComponent } from './form-wrapper.component';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';

@NgModule({
    declarations: [FormWrapperComponent],
    imports: [DynamicFormModule],
    exports: [FormWrapperComponent]
})

export class FormWrapperModule { }
