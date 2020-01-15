import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  DYNAMIC_FORM_ACTION_FROM_PARENT,
  DYNAMIC_FORM_VALIDATION_TYPES,
  DynamicFormControlBase,
  DynamicFormControlType,
  IDictionary,
  IDynamicFormConfig,
  IDynamicFormControlUpdateDataModel,
  IDynamicFormCustomValidation,
  IDynamicFormValidationObject,
} from './dynamic-form.models';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() formConfig: IDynamicFormConfig;
  @Input() hideErrors: boolean;
  @Output() formSubmit = new EventEmitter();

  public formRowCount: number;
  public dynamicForm: FormGroup;
  public formRowCellCountList: number[] = [];
  public formControlTypes = DynamicFormControlType;
  public selectSearchControl: IDictionary<any> = {};
  public validationErrorMessages: IDictionary<IDictionary<string>> = {};
  public selectOptionDictionary: IDictionary<any> = {};

  private selectOptionDataValueParam: IDictionary<string> = {};
  private selectOptionDictionaryMaster: IDictionary<any> = {};
  private currentOpenSelectControlName: string;
  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.buildDynamicReactiveFormObjectModel();
    this.subscribeFormControlChangeFromParent();
    this.subscribeFormActionFromParent();
  }

  /**
   * Handle form submit
   * @memberof DynamicFormComponent
   */
  public onFormSubmit() {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      this.validateFormControls();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public formControlValueChange(key: string) {
    if (this.formConfig.controlValueChangeObservable) {
      this.formConfig.controlValueChangeObservable.next({
        key,
        value: this.dynamicForm.value[key]
      });
    }
  }

  public toggleSelect(isOpen: string, formControlName: string) {
    if (!isOpen && formControlName) {
      this.filterSelectDropDowns('', this.currentOpenSelectControlName);
    }
    this.currentOpenSelectControlName = isOpen ? formControlName : '';
  }

  private validateFormControls() {
    let control;
    // If form is not valid, checking each field which is dirty.
    for (const field in this.dynamicForm.controls) {
      if (field) {
        control = this.dynamicForm.get(field);
        control.markAsTouched({ onlySelf: true });
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
          // updateOn: 'blur'
        }];
        if ([DynamicFormControlType.select, DynamicFormControlType.multiSelect].includes(cell.type)) {
          this.selectOptionDictionary[cell.key] = cell.data;
          this.selectOptionDictionaryMaster[cell.key] = cell.data;
          this.selectOptionDataValueParam[cell.key] = cell.dataValueParam;
          this.selectSearchControl[cell.key] = new FormControl();
          const subscription = this.selectSearchControl[cell.key].valueChanges
            .subscribe((searchString: string) => {
              this.filterSelectDropDowns(searchString, this.currentOpenSelectControlName);
            });
          this.subscriptions.push(subscription);
        }
      }
    }
    this.dynamicForm = this.formBuilder.group(formGroup);
  }

  private filterSelectDropDowns(searchString: string, selectControlKey: string) {
    const searchStringLower = searchString.toLowerCase();
    this.selectOptionDictionary[selectControlKey] =
      searchString ? this.selectOptionDictionaryMaster[selectControlKey]
        .filter(data => data[this.selectOptionDataValueParam[selectControlKey]].toLowerCase()
          .indexOf(searchStringLower) > -1)
        : this.selectOptionDictionaryMaster[selectControlKey];
  }

  /**
   * Handle event emit form the parent for updating form control value or drop-down options.
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
        if (data.newOptions) {
          this.selectOptionDictionary[data.key] = data.newOptions;
          if ([DynamicFormControlType.select, DynamicFormControlType.multiSelect].includes(data.type)) {
            this.selectOptionDictionaryMaster[data.key] = data.newOptions;
          }
        }
        if (data.validations) {
          this.dynamicForm.controls[data.key].setValidators(this.getFieldValidators({
            key: data.key,
            validation: data.validations
          }));
        } else {
          this.dynamicForm.controls[data.key].clearValidators();
        }
        this.dynamicForm.controls[data.key].updateValueAndValidity();
      }
    });
  }

  public subscribeFormActionFromParent() {
    this.formConfig.formActionSubject
      .subscribe(action => {
        if (action === DYNAMIC_FORM_ACTION_FROM_PARENT.SUBMIT) {
          this.validateFormControls();
          this.formConfig.formSubmitSubject.next({
            isValid: this.dynamicForm.valid,
            formData: this.dynamicForm.value
          });
        } else if (action === DYNAMIC_FORM_ACTION_FROM_PARENT.CLEAR) {
          this.dynamicForm.reset();
        }
      });
  }

  /**
   * Building form control validation array for each form control based on the validation
   * array passed from the parent. There are two type of validations can be passed ready made angular
   * validations (eg, required, min, max, etc...) and custom validation functions. Here custom and angular
   * own validations are processed separately and pushed to the same validator array.
   * @param {DynamicFormControlBase<any>} control
   * @memberof DynamicFormComponent
   */
  private getFieldValidators(control: {
    validation: IDynamicFormValidationObject,
    key: string;
  }) {
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
            formValidatorList.push([DYNAMIC_FORM_VALIDATION_TYPES.REQUIRED, DYNAMIC_FORM_VALIDATION_TYPES.EMAIL].includes(key) ?
              Validators[key] : Validators[key](control.validation[key]));
          }
        }
      }
    }
    return formValidatorList;
  }


  /**
   * Building validation messages for angular own validations.
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
