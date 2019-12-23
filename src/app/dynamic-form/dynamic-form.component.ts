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
  public validationErrorMessages: IDictionary;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    const formGroup: any = {};
    for (const rows of this.formConfig.controls) {
      for (const cell of rows) {
        formGroup[cell.key] = [{
          value: cell.value,
          disabled: cell.isDisabled
        }, this.getFieldValidators(cell)];
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
    const formValidatorList = control.isRequired ? [Validators.required] : [];
    if (control.validation) {
      for (const key in control.validation) {
        if (control.validation.hasOwnProperty(key)) {
          if (key === DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS &&
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS] &&
            control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS].length) {
            const customValidations = control.validation[DYNAMIC_FORM_VALIDATION_TYPES.CUSTOM_VALIDATIONS];
            customValidations.forEach((validation: IDynamicFormCustomValidation) => {
              formValidatorList.push(validation.validator);
              this.validationErrorMessages[validation.validator.name] = validation.validationMessage;
            });
          } else {
            formValidatorList.push(Validators[key](control.validation[key]));
          }
        }
      }
      // control.validation.forEach((validation: IDynamicFormValidator) => {
      //   debugger
      //   validations.push(validation.validator);
      // });
    }
    return formValidatorList;
  }
}
