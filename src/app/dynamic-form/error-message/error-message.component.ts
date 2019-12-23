import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DYNAMIC_FORM_VALIDATION_TYPES } from '../dynamic-form.models';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.sass']
})
export class ErrorMessageComponent implements OnInit {
  @Input() label: string;
  @Input() dynamicFormControl: FormControl;
  @Input() errorMessages: { [key: string]: string };

  constructor() { }

  ngOnInit() {
  }

  public getValidationErrorMessage(errorObject): string {
    for (const key in errorObject) {
      if (errorObject.hasOwnProperty(key) && this.errorMessages[key]) {
        return this.errorMessages[key];
      }
    }
  }
}
