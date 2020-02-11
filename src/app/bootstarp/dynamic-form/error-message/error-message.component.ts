import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent implements OnInit {

  public formControl: any;

  @Input() keys: any[];
  @Input() label: string;
  @Input() form: FormGroup;
  @Input() errorMessages: { [key: string]: string };

  constructor() { }

  ngOnInit() {
    this.keys.forEach((key: any, index: number) => {
      this.formControl = index === 0 ? this.form.controls[key] : isNaN(key)
        ? this.formControl.controls[key] : this.formControl.at(key);
    });
  }

  public getValidationErrorMessage(errorObject): string {
    let resultObj: any;
    for (const key in errorObject) {
      if (errorObject.hasOwnProperty(key) && this.errorMessages) {
        resultObj = this.errorMessages;
        for (const controlKey of this.keys) {
          resultObj = resultObj[controlKey];
        }
        return resultObj[key];
      }
    }
  }
}
