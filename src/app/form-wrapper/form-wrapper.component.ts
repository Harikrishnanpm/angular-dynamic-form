import { Component, OnInit } from '@angular/core';
import { DatePickerFormControl, DynamicFormControlType, MultiSelectFormControl } from './../dynamic-form/dynamic-form.models';
import { IDynamicFormConfig, SelectFormControl, TextFormControl } from '../dynamic-form/dynamic-form.models';
import { Validators } from '@angular/forms';

interface ICountry {
  CountryId: number;
  CountryName: string;
}
function validateThis() {

}

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.sass']
})
export class FormWrapperComponent implements OnInit {

  public dynamicFormConfig: IDynamicFormConfig;
  constructor() { }

  ngOnInit() {
    const countries: ICountry[] = [{
      CountryId: 1,
      CountryName: 'India'
    }, {
      CountryId: 2,
      CountryName: 'Sri Lanka'
    }];
    this.dynamicFormConfig = {
      controls: [
        [
          new DatePickerFormControl({
            label: 'control1',
            value: "hiii",
            key: 'test1',
            dateFormat: "",
            isRequired: true,
            isDisabled: false
          }),
          new MultiSelectFormControl<ICountry>({
            label: 'control2',
            value: [],
            key: 'test2',
            isRequired: true,
            isDisabled: false,
            data: countries,
            dataValueParam: "CountryName",
            dataIdParam: "CountryId"
          }),
          new TextFormControl({
            label: 'control3',
            value: "",
            key: 'test3',
            isRequired: true,
            isDisabled: false,
            validation: {
              minLength: 7,
              maxLength: 10,
              customValidations: [{
                validator: validateThis,
                validationMessage: 'test'
              }]
            }
          }),
          new TextFormControl({
            label: 'control3',
            value: "",
            key: 'test90',
            isRequired: true,
            isDisabled: false
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
          new SelectFormControl<ICountry>({
            label: 'control6',
            value: null,
            key: 'test6',
            data: countries,
            dataValueParam: "CountryName",
            dataIdParam: "CountryId"
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
            key: 'test10',
            data: countries,
            dataValueParam: "CountryName",
            dataIdParam: "CountryId"
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
            key: 'test13',
            data: countries,
            dataValueParam: "CountryName",
            dataIdParam: "CountryId"
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
            key: 'test16',
            data: countries,
            dataValueParam: "CountryName",
            dataIdParam: "CountryId"
          })
        ]
      ]
    };
  }

  public onFormSubmit(formData) {
  }
}
