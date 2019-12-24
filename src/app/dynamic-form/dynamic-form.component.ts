import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  DYNAMIC_FORM_VALIDATION_TYPES,
  DynamicFormControlBase,
  DynamicFormControlType,
  IDictionary,
  IDynamicFormConfig,
  IDynamicFormControlUpdateDataModel,
  IDynamicFormCustomValidation,
} from './dynamic-form.models';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  @Input() formConfig: IDynamicFormConfig;
  @Output() formSubmit = new EventEmitter();

  public formRowCount: number;
  public dynamicForm: FormGroup;
  public formRowCellCountList: number[] = [];
  public formControlTypes = DynamicFormControlType;
  public validationErrorMessages: {
    [key: string]: IDictionary
  } = {};

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.buildDynamicReactiveFormObjectModel();
    this.subscribeFormControlChangeFromParent();
  }

  /**
   * Handle form submit
   * @memberof DynamicFormComponent
   */
  public onFormSubmit() {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      let control;
      // If form is not valid, checking each field which is dirty.
      for (const field in this.dynamicForm.controls) {
        if (field) {
          control = this.dynamicForm.get(field);
          control.markAsTouched({ onlySelf: true });
        }
      }
    }
  }


  /**
   * Building reactive form object model by using model from parent.
   * @private
   * @memberof DynamicFormComponent
   */
  private buildDynamicReactiveFormObjectModel() {
    const formGroup: any = {};
    for (const rows of this.formConfig.controls) {
      for (const cell of rows) {
        formGroup[cell.key] = [{
          value: cell.value,
          disabled: cell.isDisabled
        }, {
          validators: this.getFieldValidators(cell),
          updateOn: 'blur'
        }];
      }
    }
    this.dynamicForm = this.formBuilder.group(formGroup);
  }

  /**
   * Handle event emit form the parent for updating form control value or drop-down options.
   * @private
   * @memberof DynamicFormComponent
   */
  private subscribeFormControlChangeFromParent() {
    this.formConfig.controlUpdateObservable.subscribe({
      next: (data: IDynamicFormControlUpdateDataModel<any, any>) => {
        // Check for value update.
        if (typeof data.newValue !== 'undefined') {
          this.dynamicForm.patchValue({
            [data.key]: data.newValue
          });
        }
      }
    });
  }

  /**
   * Building form control validation array for each form control based on the validation
   * array passed from the parent. There are two type of validations can be passed ready made angular
   * validations (eg, required, min, max, etc...) and custom validation functions. Here custom and angular
   * own validations are processed separately and pushed to the same validator array.
   * @private
   * @param {DynamicFormControlBase<any>} control
   * @returns
   * @memberof DynamicFormComponent
   */
  private getFieldValidators(control: DynamicFormControlBase<any>) {
    const formValidatorList = [];
    const controlKey = control.key;
    this.validationErrorMessages[controlKey] = {};
    if (control.validation) {
      for (const key in control.validation) {
        if (control.validation.hasOwnProperty(key)) {
          if (key === DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS &&
            // User custom validation required for the form control field.
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS] &&
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS].length) {
            const customValidations = control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS];
            customValidations.forEach((validation: IDynamicFormCustomValidation) => {
              formValidatorList.push(validation.validator);
              this.validationErrorMessages[controlKey][validation.validator.name] = validation.validationMessage;
            });
          } else if (control.validation[key]) {
            // Angular own validations.
            this.validationErrorMessages[controlKey][key.toLowerCase()] = this.buildValidationMessage(key, control.validation[key]);
            formValidatorList.push(key === DYNAMIC_FORM_VALIDATION_TYPES.REQUIRED ?
              Validators[key] : Validators[key](control.validation[key]));
          }
        }
      }
    }
    return formValidatorList;
  }


  /**
   * Building validation messages for angular own validations.
   * @private
   * @param {string} type
   * @param {*} value
   * @returns {string}
   * @memberof DynamicFormComponent
   */
  private buildValidationMessage(type: string, value: any): string {
    switch (type) {
      case DYNAMIC_FORM_VALIDATION_TYPES.REQUIRED:
        return 'This field is mandatory';
      case DYNAMIC_FORM_VALIDATION_TYPES.MIN:
        return `Value should be greater than ${value}`;
      case DYNAMIC_FORM_VALIDATION_TYPES.MAX:
        return `Value should be less than ${value}`;
      case DYNAMIC_FORM_VALIDATION_TYPES.MAX_LENGTH:
        return `Value length should be less than ${value}`;
      case DYNAMIC_FORM_VALIDATION_TYPES.MIN_LENGTH:
        return `Value length should be greater than ${value}`;
      case DYNAMIC_FORM_VALIDATION_TYPES.PATTERN:
        return 'Invalid data';
      default:
        return '';
    }
  }
}
