import { Component, OnInit, Input } from '@angular/core';
import { DynamicFormControlType, SelectFormControl, MultiSelectFormControl } from '../dynamic-form.models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-select-control',
  templateUrl: './dynamic-form-select-control.component.html',
  styleUrls: ['./dynamic-form-select-control.component.sass']
})
export class DynamicFormSelectControlComponent implements OnInit {

  @Input() formConfig: SelectFormControl<any> | MultiSelectFormControl<any>;
  @Input() dynamicForm: FormGroup;
  public formControlTypes = DynamicFormControlType;
  constructor() { }

  ngOnInit() {
    console.log(this.formConfig)
    debugger
  }

}
