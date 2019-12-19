import { DatePickerFormControl, MultiSelectFormControl } from './../dynamic-form/dynamic-form.models';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  IDynamicFormConfig,
  TextFormControl,
  SelectFormControl
} from '../dynamic-form/dynamic-form.models';

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.sass']
})
export class FormWrapperComponent implements OnInit {

  public dynamicFormConfig: IDynamicFormConfig;
  constructor() { }

  ngOnInit() {
    this.dynamicFormConfig = {
      controls: [
        [
          new DatePickerFormControl({
            label: 'control1',
            value: "hiii",
            key: 'test1',
            dateFormat: "",
            isRequired: true,
            isDisabled: true
          }),
          new MultiSelectFormControl({
            label: 'control2',
            value: [],
            key: 'test2',
            isRequired: true,
            isDisabled: true
          }),
          new TextFormControl({
            label: 'control3',
            value: "",
            key: 'test3',
            isRequired: true,
            isDisabled: true
          }),
          new TextFormControl({
            label: 'control3',
            value: "",
            key: 'test90',
            isRequired: true,
            isDisabled: true
          }),
          new TextFormControl({
            label: 'control3',
            value: "",
            key: 'test56',
            isRequired: true
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test4'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test5'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test6'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test7'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test8'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test9'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test10'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test11'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test12'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test13'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test14'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test15'
          }),
          new SelectFormControl({
            label: 'control6',
            value: null,
            key: 'test16'
          })
        ]
      ]
    };
  }

  public onFormSubmit(formData) {
  }
}
