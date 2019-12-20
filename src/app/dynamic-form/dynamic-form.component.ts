import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { IDynamicFormConfig, DynamicFormControlType, DynamicFormControlBase, DatePickerFormControl } from './dynamic-form.models';

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

  public banks = [
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423",
    "sdfs", "2wer", "sfdsdf", "23423"
  ];

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {


    const formGroup: any = {};
    for (const rows of this.formConfig.controls) {
      for (const cell of rows) {
        formGroup[cell.key] = cell.isRequired ?
          [{
            value: cell.value,
            disabled: cell.isDisabled
          }, [Validators.required]
          ] :
          [{
            value: cell.value,
            disabled: cell.isDisabled
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
    const validations = control.isRequired ? [Validators.required] : [];
    switch (control.type) {
      case DynamicFormControlType.datePicker:
        const dateFormControl = control as DatePickerFormControl;
        return validations;
      default:
        return validations;
    }
  }
}
