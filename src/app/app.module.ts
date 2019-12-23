import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormWrapperModule } from './form-wrapper/form-wrapper.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormSelectControlComponent } from './dynamic-form/dynamic-form-select-control/dynamic-form-select-control.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormWrapperModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
