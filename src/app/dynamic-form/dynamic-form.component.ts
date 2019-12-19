import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { IDynamicFormConfig, DynamicFormControlType } from './dynamic-form.models';

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

  public banks = ["sdfs", "2wer", "sfdsdf", "23423"];
  public bankFilterCtrl: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    const formGroup: any = {};
    for (const rows of this.formConfig.controls) {
      for (const cell of rows) {
        formGroup[cell.key] = cell.isRequired ? [cell.value, Validators.required] : [cell.value];
      }
    }
    this.dynamicForm = this.formBuilder.group(formGroup);
  }

  public onFormSubmit() {
    this.formSubmit.emit(this.dynamicForm.value);
  }
}
