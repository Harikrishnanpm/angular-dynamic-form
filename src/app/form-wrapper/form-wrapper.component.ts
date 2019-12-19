import { DatePickerFormControl } from './../dynamic-form/dynamic-form.models';
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
            dateFormat:""
          }),
          new SelectFormControl({
            label: 'control2',
            value: "sdfd",
            key: 'test2'
          }),
          new TextFormControl({
            label: 'control3',
            value: "56756",
            key: 'test3'
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
            key: 'test4'
          }),
          new TextFormControl({
            label: 'control5',
            value: null,
            key: 'test5'
          })
        ],
        [
          new TextFormControl({
            label: 'control4',
            value: "234234",
            key: 'test4'
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
        ]
      ]
    };
  }

  public onFormSubmit(formData) {
    debugger
  }
}
