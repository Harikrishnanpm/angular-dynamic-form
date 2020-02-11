import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { deepCopy } from '../../helpers/prototype-methods';
import {
  DYNAMIC_FORM_VALIDATION_TYPES,
  DynamicFormControlType,
  IDictionary,
  IDynamicFormConfig,
  IDynamicFormControl,
  IDynamicFormControlCustomValidation,
  IDynamicFormControlHtml,
  IDynamicFormControlUpdateDataModel,
  IDynamicFormCustomValidation,
  IDynamicFormValidationObject,
  IDynamicSelectSettings,
  DynamicFormSubmitAction,
} from './dynamic-form.models';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, OnDestroy {

  public readonly internalControlType = {
    normal: 0,
    addable: 1,
    combination: 2,
    addableAndCombination: 3
  };
  public readonly formAction = DynamicFormSubmitAction;

  @Input() formConfig: IDynamicFormConfig<any>;
  @Input() hideErrors: boolean;
  @Output() formSubmit = new EventEmitter();
  public isLoaded: boolean;
  public formRowCount: number;
  public dynamicForm: FormGroup;
  public formRowCellCountList: number[] = [];
  public formControlArray: {
    label: string,
    isRequired?: boolean;
    parentKey: string;
    isAddable: boolean;
    type: DynamicFormControlType,
    controls: IDynamicFormControlHtml[]
  }[][] = [];
  public formControlTypes = DynamicFormControlType;
  public dropDownSettingsDictionary: IDictionary<IDynamicSelectSettings> = {};
  public selectSearchControl: IDictionary<any> = {};
  public validationErrorMessages: IDictionary<IDictionary<any>> = {};
  public selectOptionDictionary: IDictionary<any> = {};


  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.buildDynamicReactiveFormObjectModel();
    this.subscribeFormControlChangeFromParent();
    this.subscribeFormActionFromParent();
    this.isLoaded = true;
  }

  /**
   * Handle form submit
   * @memberof DynamicFormComponent
   */
  public onFormSubmit() {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      this.validateFormControls(this.dynamicForm.controls);
    }
  }

  public ngOnDestroy() {
  }

  public onDropDownDeselectAll(currentChildKey: string, currentControlType: number, currentRowIndex: number, currentParentKey: string) {
    const { childKey, parentKey, itemRow } = this.getDataToFindControl(currentChildKey, currentControlType,
      currentRowIndex, currentParentKey);
    const formControl = this.getNewValuePatchObject({
      parentKey,
      childKey,
      itemRowIndex: itemRow
    });
    formControl.patchValue([]);
    this.formControlValueChange(currentChildKey, currentControlType, currentRowIndex, currentParentKey);
  }

  public formControlValueChange(childKey: string, type: number, rowIndex: number, parentKey: string) {
    if (!this.formConfig.controlValueChangeObservable) {
      return;
    }
    const controlData = this.getDataToFindControl(childKey, type, rowIndex, parentKey);
    this.formConfig.controlValueChangeObservable.next({
      ...controlData,
      ...{
        value: this.getCurrentControlValue(controlData.childKey, type, controlData.itemRow, controlData.parentKey)
      }
    });
  }

  private getDataToFindControl(childKey: string, type: number = this.internalControlType.normal, rowIndex: number, parentKey: string) {
    const controlType = {
      [this.internalControlType.addable]: {
        childKey: null,
        parentKey: childKey,
        itemRow: rowIndex
      },
      [this.internalControlType.combination]: {
        childKey,
        parentKey,
        itemRow: null
      },
      [this.internalControlType.addableAndCombination]: {
        childKey,
        parentKey,
        itemRow: rowIndex
      },
      [this.internalControlType.normal]: {
        childKey: null,
        parentKey: childKey,
        itemRow: null
      }
    };
    return controlType[type];
  }

  private getCurrentControlValue(childKey: string, type: number = this.internalControlType.normal, rowIndex: number, parentKey: string) {
    switch (type) {
      case this.internalControlType.addable:
        return this.dynamicForm.get(parentKey).value[rowIndex];
      case this.internalControlType.combination:
        return this.dynamicForm.get(parentKey).value[parentKey];
      case this.internalControlType.addableAndCombination:
        return this.dynamicForm.get(parentKey).value[rowIndex][childKey];
      default:
        return this.dynamicForm.get(parentKey).value;
    }
  }

  public addFormControl(cellConfig: IDynamicFormControlHtml, parentKey: string, rowIndex: number, cellIndex: number) {
    const controlLength = this.formControlArray[rowIndex][cellIndex].controls.length;
    if (cellConfig.type === DynamicFormControlType.combinationFormControl) {
      const combinationSubForm = {};
      const newCellConfig = deepCopy(cellConfig);
      newCellConfig.showControlRemove = true;
      for (const combControl of newCellConfig.controls) {
        const key = `${parentKey}_${combControl.key}`;
        combControl.value = null;
        this.attachFormControl(combinationSubForm, combControl, parentKey, combControl.key, controlLength, key);
      }
      (this.dynamicForm.get(parentKey) as FormArray)
        .push(this.formBuilder.group(combinationSubForm));
      this.formControlArray[rowIndex][cellIndex].controls.push(newCellConfig);
    } else {
      const newCellConfig = deepCopy(cellConfig);
      newCellConfig.key = parentKey;
      newCellConfig.showControlRemove = true;
      (this.dynamicForm.get(parentKey) as FormArray)
        .push(
          this.formBuilder.group({
            [newCellConfig.key]: new FormControl('', this.getFieldValidators({
              parentKey,
              childKey: parentKey,
              itemRowIndex: controlLength,
              validation: newCellConfig.validation
            }))
          }));
      this.formControlArray[rowIndex][cellIndex].controls.push(newCellConfig);
    }
  }

  public removeFormControl(parentKey: string, controlKey: string, rowIndex: number, cellIndex: number, cellRowIndex: number) {
    (this.dynamicForm.controls[parentKey] as FormArray).removeAt(cellRowIndex);
    this.formControlArray[rowIndex][cellIndex].controls.splice(cellRowIndex, 1);
  }

  private validateFormControls(controls) {
    // If form is not valid, checking each field which is dirty.
    if (Array.isArray(controls)) {
      for (const formControl of controls) {
        if (formControl.controls) {
          this.validateFormControls(formControl.controls);
        } else {
          formControl.markAsTouched({ onlySelf: true });
        }
      }
    } else {
      let control: any;
      for (const field in controls) {
        if (field) {
          if (controls[field].controls) {
            this.validateFormControls(controls[field].controls);
          } else {
            control = controls[field];
            control.markAsTouched({ onlySelf: true });
          }
        }
      }
    }
  }

  /**
   * Building Form object model and form control array for listing controls in
   * this dom.
   * @private
   * @memberof DynamicFormComponent
   */
  private buildDynamicReactiveFormObjectModel() {
    const formGroup: object = {};
    let subFormGroup: object = {};
    this.formConfig.controls.forEach((rows, outIndex) => {
      // formControlArray is 2D array holding controls in table structure.
      this.formControlArray.push([]);
      rows.forEach((cell) => {
        // is addable control.
        if (cell.isAddable) {
          subFormGroup = {};
          const subFormGroupArray = [];
          // Addable combination control
          if (cell.type === DynamicFormControlType.combinationFormControl) {
            // If the user is passing default value for the addable control. This block
            // is for building that number of controls and adding the passing value to
            // the reactive form controls.
            if (cell.value && Array.isArray(cell.value) && cell.value.length) {
              // Here build controls for each value passed.
              let cellCopy: IDynamicFormControlHtml;
              this.addToFormControlArray(outIndex, cell, []);
              const lastIndex = this.formControlArray[outIndex].length - 1;
              cell.value.forEach((val, index) => {
                cellCopy = deepCopy(cell);
                cellCopy.showControlRemove = index !== 0;
                this.formControlArray[outIndex][lastIndex].controls.push(cellCopy);
                subFormGroupArray.push(this.buildComboFormControl(cellCopy.controls, cell.key, val, lastIndex));
              });
              formGroup[cell.key] = this.formBuilder.array(subFormGroupArray);
            } else {
              // If no value passed only build one control.
              this.addToFormControlArray(outIndex, cell, [cell]);
              formGroup[cell.key] = this.formBuilder.array([this.buildComboFormControl(cell.controls, cell.key, cell.value, 0)]);
            }
          } else {
            // Not a combination control.
            if (cell.value && Array.isArray(cell.value) && cell.value.length) {
              // if multiple default value passed. building that number of controls.
              let cellCopy: IDynamicFormControlHtml;
              let tempFormGroup: object;
              this.addToFormControlArray(outIndex, cell, []);
              const arrayLength = this.formControlArray[outIndex].length;
              cell.value.forEach((val, index) => {
                tempFormGroup = {};
                cellCopy = deepCopy(cell);
                // showControlRemove is used for showing '-' sign to delete added control.
                cellCopy.showControlRemove = index !== 0;
                cellCopy.value = val;
                this.formControlArray[outIndex][arrayLength - 1].controls.push(cellCopy);
                this.attachFormControl(tempFormGroup, cellCopy, cell.key, cell.key, index, cell.key);
                subFormGroupArray.push(this.formBuilder.group(tempFormGroup));
              });
              formGroup[cell.key] = this.formBuilder.array(subFormGroupArray);
            } else {
              // no default value build only one.
              this.addToFormControlArray(outIndex, cell, [cell]);
              this.attachFormControl(subFormGroup, cell, cell.key, cell.key, 0, cell.key);
              formGroup[cell.key] = this.formBuilder.array([this.formBuilder.group(subFormGroup)]);
            }
          }
        } else {
          // Not addable form control
          this.addToFormControlArray(outIndex, cell, [cell]);
          // If combination form control.
          if (cell.type === DynamicFormControlType.combinationFormControl) {
            subFormGroup = {};
            for (const combControl of cell.controls) {
              const key = `${cell.key}_${combControl.key}`;
              this.attachFormControl(subFormGroup, combControl, cell.key, combControl.key, null, key);
            }
            formGroup[cell.key] = this.formBuilder.group(subFormGroup);
          } else {
            this.attachFormControl(formGroup, cell, cell.key, null, null, cell.key);
          }
        }
      });
    });
    this.dynamicForm = this.formConfig.formValidators && this.formConfig.formValidators.length
      ? this.formBuilder.group(formGroup, { validators: this.buildCustomFormValidator(this.formConfig.formValidators) })
      : this.formBuilder.group(formGroup);
  }

  private buildComboFormControl(controls: IDynamicFormControl[], parentKey: string, controlValue: object, rowIndex: number) {
    const subFormGroup = {};
    for (const combControl of controls) {
      const key = `${parentKey}_${combControl.key}`;
      combControl.value = controlValue ? controlValue[combControl.key] : null;
      this.attachFormControl(subFormGroup, combControl, parentKey, combControl.key, rowIndex, key);
    }
    return this.formBuilder.group(subFormGroup);
  }

  private addToFormControlArray(index: number, config: IDynamicFormControl, controls: IDynamicFormControl[]) {
    this.formControlArray[index].push({
      controls,
      label: config.label,
      type: config.type,
      parentKey: config.key,
      isAddable: config.isAddable,
      isRequired: config.validation && config.validation.required
    });
  }

  private attachFormControl(formGroup: any, cell: IDynamicFormControl, parentKey: string, childKey: string,
    itemRowIndex: number, dropDownSettingKey: string) {
    const formControlKey = cell.key;
    formGroup[formControlKey] = this.buildFormControlObject(cell, parentKey, childKey, itemRowIndex);
    if (this.isSelectControl(cell.type)) {
      this.selectFormControl(cell, dropDownSettingKey);
    }
  }

  private buildFormControlObject(cell: IDynamicFormControl, parentKey: string, childKey: string, itemRowIndex: number) {
    return [{
      value: cell.value,
      disabled: cell.isDisabled
    }, {
      validators: this.getFieldValidators({
        childKey,
        parentKey,
        itemRowIndex,
        validation: cell.validation
      })
    }];
  }

  private selectFormControl(cell: IDynamicFormControl, dropDownSettingKey: string) {
    if (!this.dropDownSettingsDictionary[dropDownSettingKey]) {
      this.selectOptionDictionary[dropDownSettingKey] = cell.data;
      this.dropDownSettingsDictionary[dropDownSettingKey] = {
        singleSelection: cell.type === DynamicFormControlType.select,
        labelKey: cell.dataValueParam,
        primaryKey: cell.dataIdParam,
        lazyLoading: false,
        text: cell.placeholder ? cell.placeholder : 'Select',
        enableSearchFilter: cell.enableSearch,
        showCheckbox: true
      };
    }
  }

  private isSelectControl(type: DynamicFormControlType) {
    return [DynamicFormControlType.select, DynamicFormControlType.multiSelect].includes(type);
  }

  // Validator, when the form data changes
  private buildCustomFormValidator(validators: IDynamicFormCustomValidation[]) {
    const customFormValidators: ValidatorFn[] = [];
    validators.forEach(val => {
      customFormValidators.push(val.validator);
      this.validationErrorMessages[val.controlKeyName][val.validator.name] = val.validationMessage;
    });
    return customFormValidators;
  }

  /**
   * Handle event emit form the parent for updating form control value or drop-down options.
   * @memberof DynamicFormComponent
   */
  private subscribeFormControlChangeFromParent() {
    if (!this.formConfig.controlUpdateObservable) {
      return;
    }
    this.formConfig.controlUpdateObservable.subscribe({
      next: (data: IDynamicFormControlUpdateDataModel<any, any>) => {
        const formControl = this.getNewValuePatchObject({
          parentKey: data.parentKey,
          childKey: data.childKey,
          itemRowIndex: data.itemRowIndex
        });
        if (typeof data.newValue !== 'undefined') {
          formControl.patchValue(data.newValue);
        }
        if (data.newOptions) {
          const key = data.childKey ? `${data.parentKey}_${data.childKey}` : data.parentKey;
          this.selectOptionDictionary[key] = data.newOptions;
        }
        if (data.validations) {
          formControl.setValidators(this.getFieldValidators({
            parentKey: data.parentKey,
            childKey: data.childKey,
            itemRowIndex: data.itemRowIndex,
            validation: data.validations
          }));
        }
        formControl.updateValueAndValidity();
      }
    });
  }

  private getNewValuePatchObject(data: {
    parentKey: string;
    itemRowIndex: number;
    childKey: string;
  }) {
    let formControl: any = this.dynamicForm.controls[data.parentKey];

    if (data.itemRowIndex !== null && data.itemRowIndex >= 0) {
      formControl = formControl.at(data.itemRowIndex);
    }
    if (data.childKey) {
      formControl = formControl.controls[data.childKey];
    }
    return formControl;
  }

  public subscribeFormActionFromParent() {
    if (!this.formConfig.formActionSubject) {
      return;
    }
    this.formConfig.formActionSubject
      .subscribe(action => {
        if (action === DynamicFormSubmitAction.submit) {
          this.validateFormControls(this.dynamicForm.controls);
          this.formConfig.formSubmitSubject.next({
            isValid: this.dynamicForm.valid,
            formData: this.dynamicForm.value
          });
        } else if (action === DynamicFormSubmitAction.clear) {
          this.dynamicForm.reset();
        }
      });
  }

  /**
   * Building form control validation array for each form control based on the validation
   * array passed from the parent. There are two type of validations can be passed ready made angular
   * validations (eg, required, min, max, etc...) and custom validation functions. Here custom and angular
   * own validations are processed separately and pushed to the same validator array.
   * @memberof DynamicFormComponent
   */
  private getFieldValidators(control: {
    childKey: string;
    parentKey: string;
    itemRowIndex: number;
    validation: IDynamicFormValidationObject;
  }) {
    const formValidatorList = [];
    if (!this.validationErrorMessages[control.parentKey]) {
      this.validationErrorMessages[control.parentKey] = {};
    }
    if (!control.validation) {
      return [];
    }
    for (const key in control.validation) {
      if (key === DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS &&
        // User custom validation required for the form control field.
        control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS] &&
        control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS].length) {
        const customValidations = control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS];
        customValidations.forEach((validation: IDynamicFormControlCustomValidation) => {
          formValidatorList.push(validation.validator);
          this.addToValidationDictionary(control.parentKey, control.childKey, control.itemRowIndex,
            validation.validator.name, validation.validationMessage);
        });
      } else if (control.validation[key]) {
        // Angular own validations.
        this.addToValidationDictionary(control.parentKey, control.childKey, control.itemRowIndex,
          key.toLowerCase(), this.buildValidationMessage(key, control.validation[key]));
        formValidatorList.push([DYNAMIC_FORM_VALIDATION_TYPES.REQUIRED, DYNAMIC_FORM_VALIDATION_TYPES.EMAIL].includes(key) ?
          Validators[key] : Validators[key](control.validation[key]));
      }
    }
    return formValidatorList;
  }

  private addToValidationDictionary(parentKey: string, childKey: string, itemRowIndex: number, errKey: string, errMessage: string) {
    if (itemRowIndex !== null && itemRowIndex >= 0) {
      if (!this.validationErrorMessages[parentKey][itemRowIndex]) {
        this.validationErrorMessages[parentKey][itemRowIndex] = {};
      }
      this.addValidationMessage(this.validationErrorMessages[parentKey][itemRowIndex], childKey, errKey, errMessage);
      return;
    }
    this.addValidationMessage(this.validationErrorMessages[parentKey], childKey, errKey, errMessage);
  }

  private addValidationMessage(validationObj: any, childKey: string, errKey: string, errMessage: string) {
    if (!childKey) {
      validationObj[errKey] = errMessage;
      return;
    } else {
      if (!validationObj[childKey]) {
        validationObj[childKey] = {};
      }
      validationObj[childKey][errKey] = errMessage;
    }
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
      case DYNAMIC_FORM_VALIDATION_TYPES.EMAIL:
        return 'Not a valid email address';
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
