import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  DatePickerFormControl,
  DynamicFormControlBase,
  DynamicFormControlType,
  IDictionary,
  IDynamicFormConfig,
  DYNAMIC_FORM_VALIDATION_TYPES,
  IDynamicFormCustomValidation,
} from './dynamic-form.models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

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


  public onFormSubmit() {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      let control;
      for (const field in this.dynamicForm.controls) {
        if (field) {
          control = this.dynamicForm.get(field);
          control.markAsTouched({ onlySelf: true });
        }
      }
    }
  }

  private getFieldValidators(control: DynamicFormControlBase<any>) {
    const formValidatorList = [];
    const controlKey = control.key;
    this.validationErrorMessages[controlKey] = {};
    if (control.validation) {
      for (const key in control.validation) {
        if (control.validation.hasOwnProperty(key)) {
          if (key === DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS &&
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS] &&
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS].length) {
            const customValidations = control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS];
            customValidations.forEach((validation: IDynamicFormCustomValidation) => {
              formValidatorList.push(validation.validator);
              this.validationErrorMessages[controlKey][validation.validator.name] = validation.validationMessage;
            });
          } else if (control.validation[key]) {
            this.validationErrorMessages[controlKey][key.toLowerCase()] = this.buildValidationMessage(key, control.validation[key]);
            formValidatorList.push(key === DYNAMIC_FORM_VALIDATION_TYPES.REQUIRED ?
              Validators[key] : Validators[key](control.validation[key]));
          }
        }
      }
    }
    return formValidatorList;
  }

  private buildValidationMessage(type: string, value: any) {
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
